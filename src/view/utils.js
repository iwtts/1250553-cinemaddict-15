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

export const getRuntime = (runtime) => {
  if (runtime < MINUTES_IN_HOUR) {
    return `${dayjs.duration(runtime, 'minutes').minutes()}m`;
  } else if (runtime % MINUTES_IN_HOUR === 0) {
    return `${dayjs.duration(runtime, 'minutes').hours()}h`;
  }
  return `${dayjs.duration(runtime, 'minutes').hours()}h ${dayjs.duration(runtime, 'minutes').minutes()}m`;
};

export const getReleaseDate = (date, format) => dayjs(date).format(`${format}`);

