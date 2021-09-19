import dayjs from 'dayjs';

export const sortByDate = (a, b) => dayjs(b.releaseDate).diff(dayjs(a.releaseDate));
export const sortByRating = (a, b) => b.totalRating - a.totalRating;

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
