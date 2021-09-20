import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { MINUTES_IN_HOUR } from './const';

dayjs.extend(duration);

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

export const getFilmRuntime = (runtime) => {
  if (runtime < MINUTES_IN_HOUR) {
    return `${dayjs.duration(runtime, 'minutes').minutes()}m`;
  } else if (runtime % MINUTES_IN_HOUR === 0) {
    return `${dayjs.duration(runtime, 'minutes').hours()}h`;
  }
  return `${dayjs.duration(runtime, 'minutes').hours()}h ${dayjs.duration(runtime, 'minutes').minutes()}m`;
};

export const getReleaseDate = (date, format) => dayjs(date).format(`${format}`);

export const getRank = (watchedFilmsAmount) => {
  if (watchedFilmsAmount > 0 && watchedFilmsAmount < 11) {
    return 'Novice';
  }
  if (watchedFilmsAmount >= 11 && watchedFilmsAmount < 21) {
    return 'Fan';
  }
  if (watchedFilmsAmount >= 21) {
    return 'Movie Buff';
  }
};

export const getWatchedFilmsAmount = (films) => films.filter((film) => film.isAlreadyWatched).length;

export const getSortedGenres = (films) => {
  const genres = {};
  const sortedGenres = [];

  films.forEach((film) => {
    film.genres.forEach((genre) => {
      genres[genre] = genres[genre] ? ++genres[genre] : 1;
    });
  });

  for (const [genre, count] of Object.entries(genres)) {
    sortedGenres.push([genre, count]);
  }

  return sortedGenres.sort((a, b) => b[1] - a[1]);
};

const isDateInPeriod = (date, period) => dayjs(date).isAfter(dayjs().subtract(1, period));

export const getFilmsByPeriod = (films, period) => (period !== StatsFilterType.ALL_TIME.shorthand) ? films.filter((film) => isDateInPeriod(film.watchingDate, period)) : films;

export const applyUpperSnakeCase = (text) => text
  .toUpperCase()
  .split('-')
  .join('_');
