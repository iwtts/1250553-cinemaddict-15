import {createMenuTemplate} from './view/main-menu.js';
import {createHeaderProfileTemplate} from './view/header-profile.js';
import {createFilmsSectionTemplate} from './view/films-section.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmsTopRatedListTemplate} from './view/films-top-rated-list.js';
import {createFilmsMostCommentedListTemplate} from './view/films-most-commented-list.js';
import {createFilmDetailsTemplate} from './view/film-details-popup.js';
import {createFilmDetailsCommentTemplate} from './view/film-details-popup-comment.js';
import {getRandomFilm} from './mock/film.js';

const MOCK_FILMS_COUNT = 15;

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT =2;

const films = new Array(MOCK_FILMS_COUNT).fill().map(getRandomFilm);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const body = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, createHeaderProfileTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(films), 'beforeend');
render(siteMainElement, createFilmsSectionTemplate(), 'beforeend');

const filmsSectionElement = document.querySelector('.films');

render(filmsSectionElement, createFilmsListTemplate(), 'beforeend');

const filmsListElement = filmsSectionElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < FILMS_COUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');
render(filmsSectionElement, createFilmsTopRatedListTemplate(films), 'beforeend');
render(filmsSectionElement, createFilmsMostCommentedListTemplate(films), 'beforeend');

const filmsExtraListElements = filmsSectionElement.querySelectorAll('.films-list--extra');


const sortByComments = (a, b) => b.comments.length - a.comments.length;
const sortByRating = (a, b) => b.totalRating - a.totalRating;

filmsExtraListElements.forEach((element) => {
  const filmsExtraListContainerElement = element.querySelector('.films-list__container');
  if (element === filmsExtraListElements[0]) {
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      render(filmsExtraListContainerElement, createFilmCardTemplate(films.sort(sortByRating)[i]), 'beforeend');
    }
  }
  if (element === filmsExtraListElements[1]) {
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      render(filmsExtraListContainerElement, createFilmCardTemplate(films.sort(sortByComments)[i]), 'beforeend');
    }
  }
});

render(body, createFilmDetailsTemplate(films[0]), 'beforeend');

const filmsDeatailsCommentListElements = films[0].comments;

filmsDeatailsCommentListElements.forEach((comment) => {
  const filmDetailsCommentsListElement = document.querySelector('.film-details__comments-list');
  render(filmDetailsCommentsListElement, createFilmDetailsCommentTemplate(comment), 'beforeend');
});

