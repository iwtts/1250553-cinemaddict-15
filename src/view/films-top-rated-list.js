import AbstractView from './abstract.js';

const createFilmsTopRatedListTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>`
);

export default class FilmsTopRatedList extends AbstractView {
  getTemplate() {
    return createFilmsTopRatedListTemplate();
  }
}
