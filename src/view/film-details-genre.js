import AbstractView from './abstract';

const createFilmDetailsGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

export default class FilmDetailsGenre extends AbstractView {
  constructor(genre) {
    super();
    this.genre = genre;
  }

  getTemplate() {
    return createFilmDetailsGenreTemplate(this.genre);
  }
}
