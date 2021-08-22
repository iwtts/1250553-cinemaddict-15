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
import FilmsListEmptyView from './view/films-list-empty.js';
import {getRandomFilm} from './mock/film.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {isEscEvent} from './utils/common.js';
import {sortByComments, sortByRating} from './utils/sort.js';

const FILMS_COUNT = 20;
const EXTRA_FILMS_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(getRandomFilm);

const body = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const renderFilmCard = (filmsListElement, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);
  const filmDetailsPopup = new FilmDeatailsView(filmCard);
  const filmsDeatailsCommentListElements = filmCard.comments;
  const filmDetailsCommentsListElement = filmDetailsPopup.getElement().querySelector('.film-details__comments-list');

  const closeFilmDetailsPopup = () => {
    body.removeChild(filmDetailsPopup.getElement());
    body.classList.remove('hide-overflow');
    filmDetailsPopup.getElement().querySelector('.film-details__close-btn').removeEventListener('click', closeFilmDetailsPopup);
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', onFilmDetailsPopupEscKeydown);
  };

  const onFilmDetailsPopupEscKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closeFilmDetailsPopup();
    }
  };

  const openFilmDetailsPopup = () => {
    body.appendChild(filmDetailsPopup.getElement());
    body.classList.add('hide-overflow');
    filmDetailsPopup.setClickHandler(closeFilmDetailsPopup);
    document.addEventListener('keydown', onFilmDetailsPopupEscKeydown);

    filmsDeatailsCommentListElements.forEach((comment) => {
      render(filmDetailsCommentsListElement, new FilmDeatailsCommentView(comment), RenderPosition.BEFOREEND);
    });
  };

  filmCardComponent.setClickHandler(openFilmDetailsPopup);
  filmCardComponent.setClickHandler(openFilmDetailsPopup);
  filmCardComponent.setClickHandler(openFilmDetailsPopup);

  render(filmsListElement, filmCardComponent, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new HeaderProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new MainMenuView(films), RenderPosition.BEFOREEND);

const filmsSectionComponent = new FilmsSectionView();
render(siteMainElement, filmsSectionComponent, RenderPosition.BEFOREEND);

if (films.length === 0) {
  render(filmsSectionComponent, new FilmsListEmptyView(), RenderPosition.BEFOREEND);
} else {
  const filmsListComponent = new FilmsListView();
  render(filmsSectionComponent, filmsListComponent, RenderPosition.BEFOREEND);

  const filmsListContainerComponent = new FilmsListContainerView();
  render(filmsListComponent, filmsListContainerComponent, RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilmCard(filmsListContainerComponent, films[i]);
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;
    const showMoreButton = new ShowMoreButtonView();
    render(filmsListComponent, showMoreButton, RenderPosition.BEFOREEND);

    showMoreButton.setClickHandler(() => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilmCard(filmsListContainerComponent, film));
      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        remove(showMoreButton);
      }
    });
  }

  render(filmsSectionComponent, new FilmsTopRatedListView(), RenderPosition.BEFOREEND);
  render(filmsSectionComponent, new FilmsMostCommentedListView(), RenderPosition.BEFOREEND);

  const filmsExtraListElements = filmsSectionComponent.getElement().querySelectorAll('.films-list--extra');

  filmsExtraListElements.forEach((element) => {
    const filmsExtraListContainerElement = element.querySelector('.films-list__container');
    if (element === filmsExtraListElements[0]) {
      for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
        renderFilmCard(filmsExtraListContainerElement, films.sort(sortByRating)[i]);
      }
    }
    if (element === filmsExtraListElements[1]) {
      for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
        renderFilmCard(filmsExtraListContainerElement, films.sort(sortByComments)[i]);
      }
    }
  });
}

