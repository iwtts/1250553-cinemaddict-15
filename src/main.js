import MainMenuView from './view/main-menu.js';
import HeaderProfileView from './view/header-profile.js';
import FilmsPresenter from './presenter/films.js';
import {getRandomFilm} from './mock/film.js';
import {render} from './utils/render.js';

const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(getRandomFilm);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, new HeaderProfileView());
render(siteMainElement, new MainMenuView(films));

const filmsPresenter = new FilmsPresenter(siteMainElement);
filmsPresenter.init(films);
