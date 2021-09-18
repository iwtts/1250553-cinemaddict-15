//import HeaderProfileView from './view/header-profile';
import HeaderProfilePresenter from './presenter/header-profile';
import MainNavigationView from './view/main-navigation';
import StatsView from './view/stats.js';
import FooterStatiscticsView from './view/footer-statistics';

import MainFilmsPresenter from './presenter/main-films';
import FilterPresenter from './presenter/filter';

import FilmsModel from './model/films';
import FilterModel from './model/filter';
import HeaderProfileModel from './model/header-profile';

import { RenderPosition, render, remove } from './utils/render';
import { generateFilm } from './mock/film';
import { FilterType } from './const';

const FILMS_COUNT = 25;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const headerProfileModel = new HeaderProfileModel();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const mainNavigationComponent = new MainNavigationView();
const headerProfilePresenter = new HeaderProfilePresenter(headerElement, filmsModel, headerProfileModel);
const mainFilmsPresenter = new MainFilmsPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainNavigationComponent, filterModel, filmsModel);
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

headerProfilePresenter.init();
render(mainElement, mainNavigationComponent);

let statsComponent = null;

const handleNavigationClick = (filterType) => {
  //придумать нормальное решение для переключения класса
  if (filterType === 'stats') {
    mainNavigationComponent.getElement().querySelector('[data-name="stats"]').classList.add('main-navigation__additional--active');
    mainNavigationComponent.getElement().querySelectorAll('a').forEach((element) => {
      element.classList.remove('main-navigation__item--active');
    });
  } else {
    mainNavigationComponent.getElement().querySelector('[data-name="stats"]').classList.remove('main-navigation__additional--active');
  }

  switch (filterType) {
    case FilterType.ALL:
      remove(statsComponent);
      mainFilmsPresenter.destroy();
      mainFilmsPresenter.init();
      break;
    case FilterType.WATCHLIST:
      remove(statsComponent);
      mainFilmsPresenter.destroy();
      mainFilmsPresenter.init();
      break;
    case FilterType.HISTORY:
      remove(statsComponent);
      mainFilmsPresenter.destroy();
      mainFilmsPresenter.init();
      break;
    case FilterType.FAVORITES:
      remove(statsComponent);
      mainFilmsPresenter.destroy();
      mainFilmsPresenter.init();
      break;
    case FilterType.STATS:
      mainFilmsPresenter.destroy();
      remove(statsComponent);
      statsComponent = new StatsView(filmsModel.getFilms());
      render(mainElement, statsComponent, RenderPosition.AFTEREND);
      break;
  }
};

mainNavigationComponent.setNavigationClickHandler(handleNavigationClick);
filterPresenter.init();
mainFilmsPresenter.init();
render(footerStatisticsContainerElement, new FooterStatiscticsView(films.length));
