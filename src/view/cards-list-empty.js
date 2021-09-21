import AbstractView from './abstract';

import { FilterType } from '../const';

const CardsListEmptyTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createCardsListEmptyTemplate = (filterType) => {
  const filmListEmptyTextValue = CardsListEmptyTextType[filterType];

  return `<section class="films-list">
    <h2 class="films-list__title">${filmListEmptyTextValue}</h2>
  </section>`;
};

export default class CardsListEmpty extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createCardsListEmptyTemplate(this._data);
  }
}
