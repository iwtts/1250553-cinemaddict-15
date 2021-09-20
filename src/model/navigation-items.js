import AbstractObserver from '../utils/abstract-observer';
import { NavigationItem } from '../const';

export default class NavigationItems extends AbstractObserver {
  constructor() {
    super();
    this._activeNavigationItem = NavigationItem.FILMS;
  }

  setNavigationItem(updateType, navigationItem) {
    this._activeNavigationItem = navigationItem;
    this._notify(updateType, navigationItem);
  }

  getNavigationItem() {
    return this._activeNavigationItem;
  }
}
