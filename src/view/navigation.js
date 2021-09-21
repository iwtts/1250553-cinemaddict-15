import AbstractView from './abstract';
import { FilterType, NavigationItem } from '../const';

const createNavigationItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a
    href="#${type}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    title="${type}"
    data-nav="${NavigationItem.FILMS}">
      ${name}
      ${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`;
};

const createNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .slice(0, 4)
    .map((filter) => createNavigationItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats"
    class="main-navigation__additional"
    title="${FilterType.STATS}"
    data-nav="${NavigationItem.STATS}">
      Stats
    </a>
  </nav>`;
};

export default class Navigation extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._navigationClickHandler = this._navigationClickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._filters, this._currentFilter);
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.matches('.main-navigation__item')) {
      this._callback.filterClick(evt.target.title);
    }
  }

  _navigationClickHandler(evt) {
    if (evt.target.matches('a')) {
      this._callback.navigationClick(evt.target.dataset.nav);
    }
  }

  setFilterClickHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }

  setNavigationClickHandler(callback){
    this._callback.navigationClick = callback;
    this.getElement().addEventListener('click', this._navigationClickHandler);
  }
}
