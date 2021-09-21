import AbstractView from './abstract';

const createCardsSectionTemplate = () => (
  `<section class="films">
  </section>`
);

export default class CardsSection extends AbstractView {
  getTemplate() {
    return createCardsSectionTemplate();
  }
}
