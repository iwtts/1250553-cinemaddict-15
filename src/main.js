import HeaderProfilePresenter from './presenter/header-profile';
import StatsView from './view/stats.js';
import FooterStatiscticsView from './view/footer-statistics';

import Api from './api.js';

import NavigationPresenter from './presenter/navigation';
import MainFilmsPresenter from './presenter/main-films';

import FilmsModel from './model/films';
import FilterModel from './model/filter';
import HeaderProfileModel from './model/header-profile';

import { RenderPosition, render, remove } from './utils/render';
import { UpdateType } from './const';

const AUTHORIZATION = 'Basic xX2sd3dfSwcX1sa2x';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const headerProfileModel = new HeaderProfileModel();
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const headerProfilePresenter = new HeaderProfilePresenter(headerElement, filmsModel, headerProfileModel);
const mainFilmsPresenter = new MainFilmsPresenter(mainElement, filmsModel, filterModel, api);

let statsComponent = null;

const showFilms = () => {
  remove(statsComponent);
  mainFilmsPresenter.destroy();
  mainFilmsPresenter.init();
};

const showStats = () => {
  mainFilmsPresenter.destroy();
  remove(statsComponent);
  statsComponent = new StatsView(filmsModel.getFilms());
  render(mainElement, statsComponent, RenderPosition.AFTEREND);
};

const navigationPresenter = new NavigationPresenter(mainElement, filterModel, filmsModel, showFilms, showStats);

headerProfilePresenter.init();
navigationPresenter.init();
mainFilmsPresenter.init();
render(footerStatisticsContainerElement, new FooterStatiscticsView(filmsModel.getFilms().length));

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });


