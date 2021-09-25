import { FilterType } from '../const';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isAlreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

