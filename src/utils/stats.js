import dayjs from 'dayjs';

export const StatsFilterType = {
  ALL_TIME: {
    name: 'all-time',
    shorthand: 'all',
  },
  TODAY: {
    name: 'today',
    shorthand: 'd',
  },
  WEEK: {
    name: 'week',
    shorthand: 'w',
  },
  MONTH: {
    name: 'month',
    shorthand: 'M',
  },
  YEAR: {
    name: 'year',
    shorthand: 'y',
  },
};

export const getWatchedFilms = (films) => films.filter((film) => film.isAlreadyWatched);

const isDateInPeriod = (date, period) => dayjs(date).isAfter(dayjs().subtract(1, period));

export const getFilmsByPeriod = (films, period) => (period !== StatsFilterType.ALL_TIME.shorthand)
  ? films.filter((film) => isDateInPeriod(film.watchingDate, period))
  : films;

const getGenres = (films) => [...new Set(films.reduce((acc, film) => ([...acc, ...film.genres]), []))];

const getCountFilmsByGenre = (films, currentGenre) => films
  .reduce((count, film) => count + (film.genres.some((filmGenre) => filmGenre === currentGenre)), 0);

const sortGenresByCount = (firstGenre, secondGenre) => secondGenre.count - firstGenre.count;

export const getChartOptions = (films) => {
  const genresByCount = getGenres(films)
    .map((genre) => ({genre, count: getCountFilmsByGenre(films, genre)}))
    .sort(sortGenresByCount);
  const genres = genresByCount.map((item) => item.genre);

  return {
    topGenre: genres[0],
    genres: genres,
    counts: genresByCount.map((item) => item.count),
  };
};

export const applyUpperSnakeCase = (text) => text
  .toUpperCase()
  .split('-')
  .join('_');


const RANKS = {
  1: 'Novice',
  11: 'Fan',
  21: 'Movie Buff',
};

export const getRank = (wathedAmount) => {
  let textRank = '';

  for (const [key, value] of Object.entries(RANKS)) {
    if (wathedAmount > key) {
      textRank = value;
    }
  }

  return textRank;
};
