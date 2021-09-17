import AbstractView from './abstract';
import { getWatchedFilms, getRank } from '../utils/stats';

const createHeaderProfileTemplate = (films) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRank(getWatchedFilms(films).length)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class HeaderProfile extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._films);
  }
}
