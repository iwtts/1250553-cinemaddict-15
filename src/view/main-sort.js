import AbstractView from './abstract';
import { SortType } from '../const';

const createMainSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class MainSort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;

    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
