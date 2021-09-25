import FilmsModel from '../model/films';
import { isOnline } from '../utils/common';

const getSyncedTasks = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.task);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  getComments(filmId){
    if (isOnline()) {
      return this._api.getComments(filmId);
    }

    return Promise.reject(new Error('Get comments failed'));
  }

  addComment(comment, filmId) {
    if (isOnline()) {
      return this._api.addComment(comment, filmId);
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  addFilm(film) {
    if (isOnline()) {
      return this._api.addFilm(film)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, FilmsModel.adaptToServer(newFilm));
          return newFilm;
        });
    }

    return Promise.reject(new Error('Add film failed'));
  }

  deleteFilm(film) {
    if (isOnline()) {
      return this._api.deleteFilm(film)
        .then(() => this._store.removeItem(film.id));
    }

    return Promise.reject(new Error('Delete film failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const createdFilms = getSyncedTasks(response.created);
          const updatedFilms = getSyncedTasks(response.updated);

          const items = createStoreStructure([...createdFilms, ...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
