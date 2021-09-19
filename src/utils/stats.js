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

const isDateInPeriod = (date, period) => dayjs(date).isAfter(dayjs().subtract(1, period));

export const getFilmsByPeriod = (films, period) => (period !== StatsFilterType.ALL_TIME.shorthand) ? films.filter((film) => isDateInPeriod(film.watchingDate, period)) : films;

export const applyUpperSnakeCase = (text) => text
  .toUpperCase()
  .split('-')
  .join('_');
