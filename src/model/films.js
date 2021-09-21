import AbstractObserver from '../utils/abstract-observer';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        id: film['id'],
        comments: film['comments'],
        title: film['film_info']['title'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        poster: film['film_info']['poster'],
        ageRating: film['film_info']['age_rating'],
        director: film['film_info']['director'],
        writers: film['film_info']['writers'],
        actors: film['film_info']['actors'],
        releaseDate: film['film_info']['release']['date'],
        releaseCountry: film['film_info']['release']['release_country'],
        runtime: film['film_info']['runtime'],
        genres: film['film_info']['genre'],
        description: film['film_info']['description'],
        isInWatchList: film['user_details']['watchlist'],
        isAlreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
        isFavorite: film['user_details']['favorite'],
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'id': film.id,
        'comments': film.comments,
        'film_info': {
          'title': film.title,
          'alternative_title': film.alternativeTitle,
          'total_rating': film.totalRating,
          'poster': film.poster,
          'age_rating': film.ageRating,
          'director': film.director,
          'writers': film.writers,
          'actors': film.actors,
          'release': {
            'date': film.releaseDate,
            'release_country': film.releaseCountry,
          },
          'runtime': film.runtime,
          'genre': film.genres,
          'description': film.description,
        },
        'user_details': {
          'watchlist': film.isInWatchList,
          'already_watched': film.isAlreadyWatched,
          'watching_date': film.watchingDate,
          'favorite': film.isFavorite,
        },
      },
    );

    delete adaptedFilm.title;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.releaseCountry;
    delete adaptedFilm.runtime;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.isInWatchList;
    delete adaptedFilm.isAlreadyWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isFavorite;

    return adaptedFilm;
  }
}
