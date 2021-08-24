import AbstractView from './abstract.js';

const createFilmsMostCommentedListTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`
);

export default class FilmsMostCommentedList extends AbstractView {
  getTemplate() {
    return createFilmsMostCommentedListTemplate();
  }
}
