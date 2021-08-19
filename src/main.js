import MainMenuView from './view/main-menu.js';
import HeaderProfileView from './view/header-profile.js';
import FilmsSectionView from './view/films-section.js';
import FilmsListView from './view/films-list.js';
import FilmsListContainerView from './view/films-list-container.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmsTopRatedListView from './view/films-top-rated-list.js';
import FilmsMostCommentedListView from './view/films-most-commented-list.js';
import FilmDeatailsView from './view/film-details-popup.js';
import FilmDeatailsCommentView from './view/film-details-popup-comment.js';
import {getRandomFilm} from './mock/film.js';
import {render, RenderPosition} from './utils.js';

const FILMS_COUNT = 15;
const EXTRA_FILMS_COUNT =2;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(getRandomFilm);

const body = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, new HeaderProfileView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new MainMenuView(films).getElement(), RenderPosition.BEFOREEND);

const filmsSectionComponent = new FilmsSectionView();
render(siteMainElement, filmsSectionComponent.getElement(), RenderPosition.BEFOREEND);

const filmsListComponent = new FilmsListView();
render(filmsSectionComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);

const filmsListContainerComponent = new FilmsListContainerView();
render(filmsListComponent.getElement(), filmsListContainerComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmsListContainerComponent.getElement(), new FilmCardView(films[i]).getElement(), RenderPosition.BEFOREEND);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;
  const showMoreButton = new ShowMoreButtonView();
  render(filmsListComponent.getElement(), showMoreButton.getElement(), RenderPosition.BEFOREEND);

  showMoreButton.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainerComponent.getElement(), new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.getElement().remove();
    }
  });
}

render(filmsSectionComponent.getElement(), new FilmsTopRatedListView().getElement(), RenderPosition.BEFOREEND);
render(filmsSectionComponent.getElement(), new FilmsMostCommentedListView().getElement(), RenderPosition.BEFOREEND);

const filmsExtraListElements = filmsSectionComponent.getElement().querySelectorAll('.films-list--extra');

const sortByComments = (a, b) => b.comments.length - a.comments.length;
const sortByRating = (a, b) => b.totalRating - a.totalRating;

filmsExtraListElements.forEach((element) => {
  const filmsExtraListContainerElement = element.querySelector('.films-list__container');
  if (element === filmsExtraListElements[0]) {
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      render(filmsExtraListContainerElement, new FilmCardView(films.sort(sortByRating)[i]).getElement(), RenderPosition.BEFOREEND);
    }
  }
  if (element === filmsExtraListElements[1]) {
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      render(filmsExtraListContainerElement, new FilmCardView(films.sort(sortByComments)[i]).getElement(), RenderPosition.BEFOREEND);
    }
  }
});

render(body, new FilmDeatailsView(films[0]).getElement(), RenderPosition.BEFOREEND);

const filmsDeatailsCommentListElements = films[0].comments;

filmsDeatailsCommentListElements.forEach((comment) => {
  const filmDetailsCommentsListElement = document.querySelector('.film-details__comments-list');
  render(filmDetailsCommentsListElement, new FilmDeatailsCommentView(comment).getElement(), RenderPosition.BEFOREEND);
});

