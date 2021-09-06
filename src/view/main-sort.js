import AbstractView from './abstract';
import { SortType } from '../const';

const createMainSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class MainSort extends AbstractView {
  getTemplate() {
    return createMainSortTemplate();
  }
}
