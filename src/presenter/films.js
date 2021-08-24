import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details-popup';
import FilmDetailsCommentView from '../view/film-details-popup-comment';
import FilmsListContainerView from '../view/films-list-container';
import FilmsListEmptyView from '../view/films-list-empty';
import FilmsListView from '../view/films-list';
import FilmsMostCommentedListView from '../view/films-most-commented-list';
import FilmsSectionView from '../view/films-section';
import FilmsTopRatedListView from '../view/films-top-rated-list';
import ShowMoreButtonView from '../view/show-more-button';
import SortView from '../view/sort';
import {render, remove} from '../utils/render.js';
import {isEscEvent} from '../utils/common.js';
import {sortByComments, sortByRating} from '../utils/sort';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

export default class Films {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;

    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsMostCommentedListComponent = new FilmsMostCommentedListView();
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsTopRatedListComponent = new FilmsTopRatedListView();
    this._sortComponent = new SortView();
  }

  init(films) {
    this._films = films;

    render(this._filmsContainer, this._filmsSectionComponent);

    this._renderFilms();
  }

  _renderSort() {
    render(this._filmsSectionComponent, this._sortComponent);
  }

  _renderFilmsList() {

    render(this._filmsSectionComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderFilmCards(0, Math.min(this._films.length, FILMS_COUNT_PER_STEP));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmCard(film, place = this._filmsListContainerComponent) {
    const body = document.querySelector('body');
    const filmCardComponent = new FilmCardView(film);
    const filmDetailsPopup = new FilmDetailsView(film);
    const filmsDeatailsCommentListElements = film.comments;
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
      if (body.lastElementChild.className === 'film-details') {
        body.lastElementChild.remove();
      }
      body.appendChild(filmDetailsPopup.getElement());
      body.classList.add('hide-overflow');
      filmDetailsPopup.setClickHandler(closeFilmDetailsPopup);
      document.addEventListener('keydown', onFilmDetailsPopupEscKeydown);

      filmsDeatailsCommentListElements.forEach((comment) => {
        render(filmDetailsCommentsListElement, new FilmDetailsCommentView(comment));
      });
    };

    filmCardComponent.setClickHandler(openFilmDetailsPopup);
    filmCardComponent.setClickHandler(openFilmDetailsPopup);
    filmCardComponent.setClickHandler(openFilmDetailsPopup);

    render(place, filmCardComponent);
  }

  _renderFilmCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(film));
  }

  _renderFilmListEmpty() {
    render(this._filmsSectionComponent, this._filmsListEmptyComponent);
  }

  _renderShowMoreButton() {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;
    const showMoreButton = new ShowMoreButtonView();

    render(this._filmsSectionComponent, showMoreButton);

    showMoreButton.setClickHandler(() => {
      this._films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this._renderFilmCard(film));
      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= this._films.length) {
        remove(showMoreButton);
      }
    });
  }

  _renderFilmsMostCommentedList() {
    this._filmsMostCommentedListContainerComponent = new FilmsListContainerView();

    render(this._filmsSectionComponent, this._filmsMostCommentedListComponent);
    render(this._filmsMostCommentedListComponent, this._filmsMostCommentedListContainerComponent);

    this._films.sort(sortByComments)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(film, this._filmsMostCommentedListContainerComponent));
  }

  _renderFilmsTopRatedList() {
    this._filmsTopRatedListContainerComponent = new FilmsListContainerView();

    render(this._filmsSectionComponent, this._filmsTopRatedListComponent);
    render(this._filmsTopRatedListComponent, this._filmsTopRatedListContainerComponent);

    this._films.sort(sortByRating)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(film, this._filmsTopRatedListContainerComponent));
  }

  _renderFilms() {
    if (this._films.length === 0) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderSort();
    this._renderFilmsList();
    this._renderFilmsTopRatedList();
    this._renderFilmsMostCommentedList();
  }
}
