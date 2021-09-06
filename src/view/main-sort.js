import AbstractView from './abstract';

const createMainSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class MainSort extends AbstractView {
  getTemplate() {
    return createMainSortTemplate();
  }
}
