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

const FILMS_COUNT = 15;
const EXTRA_FILMS_COUNT =2;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(getRandomFilm);

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

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmsListContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');

  const loadMoreButton = filmsListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
    .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => render(filmsListContainerElement, createFilmCardTemplate(film), 'beforeend'));

  renderedFilmsCount += FILMS_COUNT_PER_STEP;

  if (renderedFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
  });
}


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

