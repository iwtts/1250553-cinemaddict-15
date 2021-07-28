import {createMenuTemplate} from './view/main-menu.js';
import {createHeaderProfileTemplate} from './view/header-profile.js';
import {createFilmsSectionTemplate} from './view/films-section.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmsTopRatedListTemplate} from './view/films-top-rated-list.js';
import {createFilmsMostCommentedListTemplate} from './view/films-most-commented-list.js';
import {createFilmDetailsTemplate} from './view/film-details-popup.js';

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT =2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const body = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, createHeaderProfileTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createFilmsSectionTemplate(), 'beforeend');

const filmsSectionElement = document.querySelector('.films');

render(filmsSectionElement, createFilmsListTemplate(), 'beforeend');

const filmsListElement = filmsSectionElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < FILMS_COUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(), 'beforeend');
}

render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');
render(filmsSectionElement, createFilmsTopRatedListTemplate(), 'beforeend');
render(filmsSectionElement, createFilmsMostCommentedListTemplate(), 'beforeend');

const filmsExtraListElements = filmsSectionElement.querySelectorAll('.films-list--extra');

filmsExtraListElements.forEach((element) => {
  const filmsExtraListContainerElement = element.querySelector('.films-list__container');
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(filmsExtraListContainerElement, createFilmCardTemplate(), 'beforeend');
  }
});

render(body, createFilmDetailsTemplate(), 'beforeend');
