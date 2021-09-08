import AbstractView from './abstract';

const createFooterStatisticsTemplate = (filmsCount) => (
  `<p>${filmsCount} movies inside</p>`
);

export default class FooterStatistics extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsCount);
  }
}
