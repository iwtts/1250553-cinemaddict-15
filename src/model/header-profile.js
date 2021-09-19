import AbstractObserver from '../utils/abstract-observer';

export default class HeaderProfile extends AbstractObserver {
  constructor() {
    super();
    this._rank = '';
  }

  setRank(updateType, rank) {
    this._rank = rank;
    this._notify(updateType, rank);
  }

  getRank() {
    return this._rank;
  }
}
