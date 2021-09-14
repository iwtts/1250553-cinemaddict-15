import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a
    href="#${type}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    title="${type}">
      ${name}${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`;
};

const createMainNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MainNavigation extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters, this._currentFilter);
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterClick(evt.target.title);
  }

  setFilterClickHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().querySelectorAll('.main-navigation__item').addEventListener('click', this._filterClickHandler);
  }
}
