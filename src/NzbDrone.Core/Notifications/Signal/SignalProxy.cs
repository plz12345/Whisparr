using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using FluentValidation.Results;
using NLog;
using NzbDrone.Common.Extensions;
using NzbDrone.Common.Http;
using NzbDrone.Common.Serializer;
using NzbDrone.Core.Localization;

namespace NzbDrone.Core.Notifications.Signal
{
    public interface ISignalProxy
    {
        void SendNotification(string title, string message, SignalSettings settings);
        ValidationFailure Test(SignalSettings settings);
    }

    public class SignalProxy : ISignalProxy
    {
        private readonly IHttpClient _httpClient;
        private readonly ILocalizationService _localizationService;
        private readonly Logger _logger;

        public SignalProxy(IHttpClient httpClient, ILocalizationService localizationService, Logger logger)
        {
            _httpClient = httpClient;
            _localizationService = localizationService;
            _logger = logger;
        }

        public void SendNotification(string title, string message, SignalSettings settings)
        {
            var text = new StringBuilder();
            text.AppendLine(title);
            text.AppendLine(message);

            var urlSignalAPI = HttpRequestBuilder.BuildBaseUrl(
                settings.UseSsl,
                settings.Host,
                settings.Port,
                "/v2/send");

            var requestBuilder = new HttpRequestBuilder(urlSignalAPI).Post();

            if (settings.AuthUsername.IsNotNullOrWhiteSpace() && settings.AuthPassword.IsNotNullOrWhiteSpace())
            {
                requestBuilder.NetworkCredential = new BasicNetworkCredential(settings.AuthUsername, settings.AuthPassword);
            }

            var request = requestBuilder.Build();

            request.Headers.ContentType = "application/json";

            var payload = new SignalPayload
            {
                Message = text.ToString(),
                Number = settings.SenderNumber,
                Recipients = new[] { settings.ReceiverId }
            };
            request.SetContent(payload.ToJson());
            _httpClient.Post(request);
        }

        public ValidationFailure Test(SignalSettings settings)
        {
            try
            {
                const string title = "Test Notification";
                const string body = "This is a test message from Whisparr";

                SendNotification(title, body, settings);
            }
            catch (WebException ex)
            {
                _logger.Error(ex, "Unable to send test message: {0}", ex.Message);
                return new ValidationFailure("Host", _localizationService.GetLocalizedString("NotificationsValidationUnableToSendTestMessage", new Dictionary<string, object> { { "exceptionMessage", ex.Message } }));
            }
            catch (HttpException ex)
            {
                _logger.Error(ex, "Unable to send test message: {0}", ex.Message);

                if (ex.Response.StatusCode == HttpStatusCode.BadRequest)
                {
                    if (ex.Response.Content.ContainsIgnoreCase("400 The plain HTTP request was sent to HTTPS port"))
                    {
                        return new ValidationFailure("UseSsl", _localizationService.GetLocalizedString("NotificationsSignalValidationSslRequired"));
                    }

                    var error = Json.Deserialize<SignalError>(ex.Response.Content);

                    var property = "Host";

                    if (error.Error.ContainsIgnoreCase("Invalid group id"))
                    {
                        property = "ReceiverId";
                    }
                    else if (error.Error.ContainsIgnoreCase("Invalid account"))
                    {
                        property = "SenderNumber";
                    }

                    return new ValidationFailure(property, _localizationService.GetLocalizedString("NotificationsValidationUnableToSendTestMessage", new Dictionary<string, object> { { "exceptionMessage", error.Error } }));
                }

                if (ex.Response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return new ValidationFailure("AuthUsername", _localizationService.GetLocalizedString("NotificationsValidationInvalidUsernamePassword"));
                }

                return new ValidationFailure("Host", _localizationService.GetLocalizedString("NotificationsValidationUnableToSendTestMessage", new Dictionary<string, object> { { "exceptionMessage", ex.Message } }));
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to send test message: {0}", ex.Message);
                return new ValidationFailure("Host", _localizationService.GetLocalizedString("NotificationsValidationUnableToSendTestMessage", new Dictionary<string, object> { { "exceptionMessage", ex.Message } }));
            }

            return null;
        }
    }
}
