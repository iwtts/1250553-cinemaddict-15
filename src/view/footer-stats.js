import AbstractView from './abstract';

const createFooterStatsTemplate = (filmsCount) => (
  `<p>${filmsCount} movies inside</p>`
);

export default class FooterStatistics extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._filmsCount);
  }
}
