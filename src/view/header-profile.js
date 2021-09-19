import AbstractView from './abstract';

const createHeaderProfileTemplate = (rank) => (
  `<section class="header__profile profile ${!rank ? 'visually-hidden' : ''}">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class HeaderProfile extends AbstractView {
  constructor(rank) {
    super();
    this._rank = rank;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._rank);
  }
}
