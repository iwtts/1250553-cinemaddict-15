import AbstractView from './abstract';
import { FilterType } from '../const';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">

    <a href="#stats"
    class="main-navigation__additional"
    data-name="${FilterType.STATS}">Stats</a>
  </nav>`
);

export default class MainNavigation extends AbstractView {
  constructor() {
    super();

    this._navigationClickHandler = this._navigationClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate();
  }

  _navigationClickHandler(evt) {
    evt.preventDefault();
    this._callback.navigationClick(evt.target.dataset.name);
  }

  setNavigationClickHandler(callback) {
    this._callback.navigationClick = callback;
    this.getElement().addEventListener('click', this._navigationClickHandler);
  }
}
