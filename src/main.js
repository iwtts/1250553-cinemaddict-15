import HeaderProfilePresenter from './presenter/header-profile';
import StatsView from './view/stats';
import FooterStatsView from './view/footer-stats';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

import NavigationPresenter from './presenter/navigation';
import CardsSectionPresenter from './presenter/cards-section';

import FilmsModel from './model/films';
import FiltersModel from './model/filters';
import HeaderProfileModel from './model/header-profile';

import { RenderPosition, render, remove } from './utils/render';
import { UpdateType } from './const';

const AUTHORIZATION = 'Basic xX2sd3dfSwcX1sa2x';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'taskmanager-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatsContainerElement = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const headerProfileModel = new HeaderProfileModel();
const filmsModel = new FilmsModel();
const filtersModel = new FiltersModel();

const headerProfilePresenter = new HeaderProfilePresenter(headerElement, filmsModel, headerProfileModel);
const cardsSectionPresenter = new CardsSectionPresenter(mainElement, filmsModel, filtersModel, apiWithProvider);

let statsComponent = null;

const showCards = () => {
  remove(statsComponent);
  cardsSectionPresenter.destroy();
  cardsSectionPresenter.init();
};

const showStats = () => {
  cardsSectionPresenter.destroy();
  remove(statsComponent);
  statsComponent = new StatsView(filmsModel.getFilms());
  render(mainElement, statsComponent, RenderPosition.AFTEREND);
};

const navigationPresenter = new NavigationPresenter(mainElement, filtersModel, filmsModel, showCards, showStats);

headerProfilePresenter.init();
navigationPresenter.init();
cardsSectionPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(footerStatsContainerElement, new FooterStatsView(filmsModel.getFilms().length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
