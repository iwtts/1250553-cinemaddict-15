import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a
    href="#${type}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    title="${type}"
    data-name="${currentFilterType}">
      ${name}
      ${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`;
};

const createMainNavigationFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>`;
};

export default class MainNavigationFilter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationFilterTemplate(this._filters, this._currentFilter);
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterClick(evt.target.title);
  }

  setFilterClickHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }
}
