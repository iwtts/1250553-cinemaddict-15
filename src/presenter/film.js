import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';
import FilmDetailsCommentView from '../view/film-details-comment';
import {render} from '../utils/render';
import {isEscEvent} from '../utils/common';

export default class Film {
  constructor(FilmContainer) {
    this._body = document.querySelector('body');
    this._filmContainer = FilmContainer;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._handleFilmClick = this._handleFilmClick.bind(this);
    this._handleFilmDetailsCloseClick = this._handleFilmDetailsCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._comments = film.comments;

    this._filmCardComponent = new FilmCardView(film);
    this._FilmDetailsComponent = new FilmDetailsView(film);
    this._filmDetailsCommentsList = this._FilmDetailsComponent.getElement().querySelector('.film-details__comments-list');

    this._filmCardComponent.setClickHandler(this._handleFilmClick);
    this._FilmDetailsComponent.setClickHandler(this._handleFilmDetailsCloseClick);

    render(this._filmContainer, this._filmCardComponent);
  }

  _openFilmDetails() {
    if (this._body.lastElementChild.className === 'film-details') {
      this._body.lastElementChild.remove();
    }

    this._body.appendChild(this._FilmDetailsComponent.getElement());
    this._body.classList.add('hide-overflow');

    this._comments.forEach((comment) => {
      render(this._filmDetailsCommentsList, new FilmDetailsCommentView(comment));
    });
  }

  _closeFilmDetails() {
    this._body.removeChild(this._FilmDetailsComponent.getElement());
    this._body.classList.remove('hide-overflow');
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent) {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _handleFilmClick() {
    this._openFilmDetails();
  }

  _handleFilmDetailsCloseClick() {
    this._closeFilmDetails();
  }
}
