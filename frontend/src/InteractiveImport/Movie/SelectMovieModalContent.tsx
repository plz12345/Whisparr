import { throttle } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import TextInput from 'Components/Form/TextInput';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Scroller from 'Components/Scroller/Scroller';
import Column from 'Components/Table/Column';
import VirtualTableRowButton from 'Components/Table/VirtualTableRowButton';
import { scrollDirections } from 'Helpers/Props';
import Movie from 'Movie/Movie';
import createAllItemsSelector from 'Store/Selectors/createAllItemsSelector';
import dimensions from 'Styles/Variables/dimensions';
import translate from 'Utilities/String/translate';
import SelectMovieModalTableHeader from './SelectMovieModalTableHeader';
import SelectMovieRow from './SelectMovieRow';
import styles from './SelectMovieModalContent.css';

const columns = [
  {
    name: 'studioTitle',
    label: () => translate('Studio'),
    isVisible: true,
  },
  {
    name: 'title',
    label: () => translate('Title'),
    isVisible: true,
  },
  {
    name: 'performers',
    label: () => translate('Performers'),
    isVisible: true,
  },
  {
    name: 'releaseDate',
    label: () => translate('ReleaseDate'),
    isVisible: true,
  },
];

const bodyPadding = parseInt(dimensions.pageContentBodyPadding);

interface SelectMovieModalContentProps {
  modalTitle: string;
  onMovieSelect(movie: Movie): void;
  onModalClose(): void;
}

interface RowItemData {
  items: Movie[];
  columns: Column[];
  onMovieSelect(movieId: number): void;
}

const Row: React.FC<ListChildComponentProps<RowItemData>> = ({
  index,
  style,
  data,
}) => {
  const { items, columns, onMovieSelect } = data;

  if (index >= items.length) {
    return null;
  }

  const movie = items[index];

  return (
    <VirtualTableRowButton
      style={{
        display: 'flex',
        'align-items': 'center',
        'border-top': '1px solid #858585',
        justifyContent: 'space-between',
        ...style,
      }}
      onPress={() => onMovieSelect(movie.id)}
    >
      <SelectMovieRow
        id={movie.id}
        title={movie.title}
        tmdbId={movie.tmdbId}
        imdbId={movie.imdbId}
        credits={movie.credits}
        studioTitle={movie.studioTitle}
        releaseDate={movie.releaseDate}
        columns={columns}
        onMovieSelect={onMovieSelect}
      />
    </VirtualTableRowButton>
  );
};

function SelectMovieModalContent(props: SelectMovieModalContentProps) {
  const { modalTitle, onMovieSelect, onModalClose } = props;

  const listRef = useRef<List<RowItemData>>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const allMovies: Movie[] = useSelector(createAllItemsSelector());
  const [filter, setFilter] = useState('');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const windowHeight = window.innerHeight;

  useEffect(() => {
    const current = scrollerRef?.current as HTMLElement;

    if (current) {
      const width = current.clientWidth;
      const height = current.clientHeight;
      const padding = bodyPadding - 5;

      setSize({
        width: width - padding * 2,
        height: height + padding,
      });
    }
  }, [windowHeight, scrollerRef]);

  useEffect(() => {
    const currentScrollerRef = scrollerRef.current as HTMLElement;
    const currentScrollListener = currentScrollerRef;

    const handleScroll = throttle(() => {
      const { offsetTop = 0 } = currentScrollerRef;
      const scrollTop = currentScrollerRef.scrollTop - offsetTop;

      listRef.current?.scrollTo(scrollTop);
    }, 10);

    currentScrollListener.addEventListener('scroll', handleScroll);

    return () => {
      handleScroll.cancel();

      if (currentScrollListener) {
        currentScrollListener.removeEventListener('scroll', handleScroll);
      }
    };
  }, [listRef, scrollerRef]);

  const onFilterChange = useCallback(
    ({ value }: { value: string }) => {
      setFilter(value);
    },
    [setFilter]
  );

  const onMovieSelectWrapper = useCallback(
    (movieId: number) => {
      const movie = allMovies.find((s) => s.id === movieId) as Movie;

      onMovieSelect(movie);
    },
    [allMovies, onMovieSelect]
  );

  const items = useMemo(() => {
    const sorted = [...allMovies].sort((a, b) =>
      a.sortTitle.localeCompare(b.sortTitle)
    );

    return sorted.filter(
      (item) =>
        item.cleanTitle.includes(
          filter.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
        ) ||
        item.stashId === filter ||
        item.tmdbId.toString() === filter
    );
  }, [allMovies, filter]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{modalTitle} - Select Movie</ModalHeader>

      <ModalBody
        className={styles.modalBody}
        scrollDirection={scrollDirections.NONE}
      >
        <TextInput
          className={styles.filterInput}
          placeholder="Filter movies"
          name="filter"
          value={filter}
          autoFocus={true}
          onChange={onFilterChange}
        />

        <Scroller
          className={styles.scroller}
          autoFocus={false}
          ref={scrollerRef}
        >
          <SelectMovieModalTableHeader columns={columns} />
          <List<RowItemData>
            ref={listRef}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'none',
            }}
            width={size.width}
            height={size.height}
            itemCount={items.length}
            itemSize={38}
            itemData={{
              items,
              columns,
              onMovieSelect: onMovieSelectWrapper,
            }}
          >
            {Row}
          </List>
        </Scroller>
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>Cancel</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default SelectMovieModalContent;
