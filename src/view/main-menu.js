import AbstractView from './abstract.js';

const createMenuTemplate = (films) => {
  const watchlist = [];
  const history = [];
  const favourites = [];

  films.forEach((film) => {
    if (film.isInWatchlist) {
      watchlist.push(film);
    }
    if (film.isAlreadyWatched) {
      history.push(film);
    }
    if (film.isFavorite) {
      favourites.push(film);
    }
  });

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favourites.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
  }
}
