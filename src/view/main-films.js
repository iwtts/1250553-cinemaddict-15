import AbstractView from './abstract';

const createMainFilmsSectionTemplate = () => (
  `<section class="films">
  </section>`
);

export default class MainFilmsSection extends AbstractView {
  getTemplate() {
    return createMainFilmsSectionTemplate();
  }
}
