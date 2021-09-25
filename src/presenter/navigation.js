import NavigationView from '../view/navigation';

import { render, replace, remove } from '../utils/render';
import { filter } from '../utils/filter';
import { FilterType, UpdateType, NavigationItem } from '../const';


export default class Navigation {
  constructor(container, filtersModel, filmsModel, showFilms, showStats) {
    this._container = container;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;
    this._showFilms = showFilms;
    this._showStats = showStats;

    this._navigationComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterClick = this._handleFilterClick.bind(this);
    this._handleNavigationClick = this._handleNavigationClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevNavigationComponent = this._navigationComponent;

    this._navigationComponent = new NavigationView(filters, this._filtersModel.getFilter());
    this._navigationComponent.setFilterClickHandler(this._handleFilterClick);
    this._navigationComponent.setNavigationClickHandler(this._handleNavigationClick);
    if (prevNavigationComponent === null) {
      render(this._container, this._navigationComponent);
      return;
    }

    replace(this._navigationComponent, prevNavigationComponent);
    remove(prevNavigationComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterClick(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MINOR, filterType);
  }

  _handleNavigationClick(navigationItem) {
    if (navigationItem === NavigationItem.STATS) {
      this._navigationComponent
        .getElement().querySelector('.main-navigation__additional')
        .classList.add('main-navigation__additional--active');
      this._navigationComponent
        .getElement().querySelectorAll('.main-navigation__item').forEach((element) => {
          element.classList.remove('main-navigation__item--active');
        });
      this._showStats();
    } else {
      this._navigationComponent
        .getElement().querySelector('.main-navigation__additional')
        .classList.remove('main-navigation__additional--active');
      this._showFilms();
    }
  }
}
