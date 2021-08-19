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
import {renderTemplate} from './utils.js';

const FILMS_COUNT = 15;
const EXTRA_FILMS_COUNT =2;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(getRandomFilm);

const body = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderTemplate(siteHeaderElement, createHeaderProfileTemplate(), 'beforeend');
renderTemplate(siteMainElement, createMenuTemplate(films), 'beforeend');
renderTemplate(siteMainElement, createFilmsSectionTemplate(), 'beforeend');

const filmsSectionElement = document.querySelector('.films');

renderTemplate(filmsSectionElement, createFilmsListTemplate(), 'beforeend');

const filmsListElement = filmsSectionElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderTemplate(filmsListContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  renderTemplate(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');

  const loadMoreButton = filmsListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsListContainerElement, createFilmCardTemplate(film), 'beforeend'));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}


renderTemplate(filmsSectionElement, createFilmsTopRatedListTemplate(films), 'beforeend');
renderTemplate(filmsSectionElement, createFilmsMostCommentedListTemplate(films), 'beforeend');

const filmsExtraListElements = filmsSectionElement.querySelectorAll('.films-list--extra');


const sortByComments = (a, b) => b.comments.length - a.comments.length;
const sortByRating = (a, b) => b.totalRating - a.totalRating;

filmsExtraListElements.forEach((element) => {
  const filmsExtraListContainerElement = element.querySelector('.films-list__container');
  if (element === filmsExtraListElements[0]) {
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      renderTemplate(filmsExtraListContainerElement, createFilmCardTemplate(films.sort(sortByRating)[i]), 'beforeend');
    }
  }
  if (element === filmsExtraListElements[1]) {
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      renderTemplate(filmsExtraListContainerElement, createFilmCardTemplate(films.sort(sortByComments)[i]), 'beforeend');
    }
  }
});

renderTemplate(body, createFilmDetailsTemplate(films[0]), 'beforeend');

const filmsDeatailsCommentListElements = films[0].comments;

filmsDeatailsCommentListElements.forEach((comment) => {
  const filmDetailsCommentsListElement = document.querySelector('.film-details__comments-list');
  renderTemplate(filmDetailsCommentsListElement, createFilmDetailsCommentTemplate(comment), 'beforeend');
});

