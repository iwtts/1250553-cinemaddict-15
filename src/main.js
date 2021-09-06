import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatiscticsView from './view/footer-statistics.js';

import MainFilmsSectionPresenter from './presenter/main-films.js';

import { render } from './utils/render.js';
import { generateFilm } from './mock/film.js';

const FILMS_COUNT = 25;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const mainFilmsSectionPresenter = new MainFilmsSectionPresenter(mainElement);
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

render(headerElement, new HeaderProfileView());
render(mainElement, new MainNavigationView(films));
mainFilmsSectionPresenter.init(films);
render(footerStatisticsContainerElement, new FooterStatiscticsView(films.length));
