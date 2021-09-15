import AbstractView from './abstract';

import { FilterType } from '../const';

const FilmListEmptyTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmsListEmptyTemplate = (filterType) => {
  const filmListEmptyTextValue = FilmListEmptyTextType[filterType];

  return `<section class="films-list">
    <h2 class="films-list__title">${filmListEmptyTextValue}</h2>
  </section>`;
};

export default class FilmsListEmpty extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createFilmsListEmptyTemplate(this._data);
  }
}
