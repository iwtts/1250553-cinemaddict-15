import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { MINUTES_IN_HOUR } from './const';

dayjs.extend(duration);

export const renderGenres = (values, place) => {
  const filmGenres = [];

  for (let i = 0; i < values.length; i++) {
    filmGenres.push(`<span class="film-${place}__genre">${values[i]}</span>`);
  }

  return `${filmGenres.join('')}`;
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

