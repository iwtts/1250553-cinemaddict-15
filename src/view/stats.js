import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import SmartView from './smart';

import { StatsFilterType, getFilmsByPeriod, getWatchedFilms, getChartOptions, applyUpperSnakeCase, getRank } from '../utils/stats';
import { getRuntime } from './utils';

const getChart = (statisticCtx, data) => {
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * data.genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: data.genres,
      datasets: [{
        data: data.counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createRankTemplate = (rank) => (
  `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
  </p>`
);

const createStatsTemplate = (data) => (
  `<section class="statistic">
    ${data.watchedAmount ? createRankTemplate(getRank(data.watchedAmount)) : ''}
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${(data.target === 'all-time') ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${(data.target === 'today') ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${(data.target === 'week') ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${(data.target === 'month') ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${(data.target === 'year') ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">
          ${data.watchedAmount} <span class="statistic__item-description">movies</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          ${getRuntime(data.totalDuration)}
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">
          ${data.topGenre ? data.topGenre : ''}
        </p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
);

export default class StatsView extends SmartView {
  constructor(films) {
    super();
    //this._rank = rank;
    this._films = getWatchedFilms(films);
    this._data = StatsView.parseFilmsToData(this._films);
    this._chart = null;
    this._setChart();

    this._statsFiltersChangeHandler = this._statsFiltersChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setChart();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('change', this._statsFiltersChangeHandler);
  }

  _statsFiltersChangeHandler(evt) {
    this._data = StatsView.parseFilmsToData(getFilmsByPeriod(
      this._films,
      StatsFilterType[applyUpperSnakeCase(evt.target.value)].shorthand),
    );

    evt.preventDefault();
    this.updateData({
      target: evt.target.value,
    });
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = getChart(statisticCtx, this._data);
  }

  static parseFilmsToData(films) {
    return {
      target: StatsFilterType.ALL_TIME.name,
      watchedAmount: films.length,
      totalDuration: films.reduce((acc, film) => (acc + film.runtime), 0),
      ...getChartOptions(films),
    };
  }
}
