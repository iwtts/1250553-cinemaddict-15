import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatiscticsView from './view/footer-statistics.js';

import MainFilmsSectionPresenter from './presenter/main-films.js';
import FilterPresenter from './presenter/filter.js';

import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

import { render } from './utils/render.js';
import { generateFilm } from './mock/film.js';

const FILMS_COUNT = 0;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const mainNavigationComponent = new MainNavigationView();
const mainFilmsSectionPresenter = new MainFilmsSectionPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainNavigationComponent, filterModel, filmsModel);
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

render(headerElement, new HeaderProfileView());
render(mainElement, mainNavigationComponent);
filterPresenter.init();
mainFilmsSectionPresenter.init();
render(footerStatisticsContainerElement, new FooterStatiscticsView(films.length));
