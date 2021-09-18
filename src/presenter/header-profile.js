import HeaderProfileView from '../view/header-profile';

import { render, replace, remove } from '../utils/render';
import { getRank, getWatchedFilmsAmount } from '../utils/common';
import { UpdateType } from '../const';

export default class HeaderProfile {
  constructor(container, filmsModel, headerProfileModel) {
    this._container = container;
    this._headerProfileModel = headerProfileModel;
    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getFilms();

    this._headerPofileComponent = null;

    this._handleHeaderProfileModelEvent = this._handleHeaderProfileModelEvent.bind(this);
    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);

    this._headerProfileModel.addObserver(this._handleHeaderProfileModelEvent);
    this._filmsModel.addObserver(this._handleFilmsModelEvent);
  }

  init() {
    const prevheaderPofileComponent = this._headerPofileComponent;

    if (prevheaderPofileComponent === null) {
      this._headerPofileComponent = new HeaderProfileView(getRank(getWatchedFilmsAmount(this._films)));
      render(this._container, this._headerPofileComponent);
      return;
    }

    if (this._container.contains(prevheaderPofileComponent.getElement())) {
      this._headerPofileComponent = new HeaderProfileView(this._headerProfileModel.getRank());
      replace(this._headerPofileComponent, prevheaderPofileComponent);
    }

    remove(prevheaderPofileComponent);

  }

  _handleHeaderProfileModelEvent() {
    this.init();
  }

  _handleFilmsModelEvent() {
    this._headerProfileModel.setRank(UpdateType.MAJOR, getRank(getWatchedFilmsAmount(this._filmsModel.getFilms())));
  }
}
