import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import {getDuration, getGenresCount, getMostPopularGenre, getUserRank} from '../utils/common';
import AbstractView from './abstract-view';

export const StatsType = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const createStatsTemplate = (films) => {
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(films)}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
           id="statistic-all-time" value="all-time" data-period="all">
      <label htmlFor="statistic-all-time" class="statistic__filters-label" data-label="all">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
             id="statistic-today" value="today" data-period="today">
        <label htmlFor="statistic-today" class="statistic__filters-label" data-label="today">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
               id="statistic-week" value="week" data-period="week">
          <label htmlFor="statistic-week" class="statistic__filters-label" data-label="week">Week</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
                 id="statistic-month" value="month" data-period="month">
            <label htmlFor="statistic-month" class="statistic__filters-label" data-label="month">Month</label>

            <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
                   id="statistic-year" value="year" data-period="year">
              <label htmlFor="statistic-year" class="statistic__filters-label" data-label="year">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${films.length} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${Math.floor(getDuration(films) / 60)} <span class="statistic__item-description">h</span> ${getDuration(films) % 60} <span
        class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${getMostPopularGenre(films)}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Stats extends AbstractView {

  constructor(films, period) {
    super();
    this._period = period;
    this._watchedFilms = films.filter((item) => item.userDetails.alreadyWatched);
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._init();

  }

  _init() {
    this._filmsInPeriod = this._getFilmsInPeriod();
    this._genres = getGenresCount(this._filmsInPeriod);
    this._setActiveInput();
    this.createCharts();
    getMostPopularGenre(this._filmsInPeriod);
  }

  _getFilmsInPeriod() {
    switch (this._period) {
      case StatsType.ALL:
        return this._watchedFilms;
      case StatsType.TODAY:
        return this._watchedFilms.filter((item) => item.rawDate >= dayjs());
      case StatsType.WEEK:
        return this._watchedFilms.filter((item) => item.rawDate >= dayjs().subtract(7, 'day'));
      case StatsType.MONTH:
        return this._watchedFilms.filter((item) => item.rawDate >= dayjs().subtract(1, 'month'));
      case StatsType.YEAR:
        return this._watchedFilms.filter((item) => item.rawDate >= dayjs().subtract(1, 'year'));

    }
  }

  setFilterClickHandler(callback) {
    this._callback.click = callback;
    const filters = Array.from(this.getElement().querySelectorAll('.statistic__filters-label'));
    filters.forEach((item) => {
      item.addEventListener('click', (evt) => this._filterClickHandler(evt));
    });
  }

  _setActiveInput() {
    const inputs = Array.from(this.getElement().querySelectorAll('.statistic__filters-input'));
    const clickedInput = inputs.find((item) => item.dataset.period === this._period);
    clickedInput.checked = true;
  }

  _filterClickHandler(evt) {
    const clickedLabel = evt.target.dataset.label;
    this._setActiveInput();
    this._period = clickedLabel;
    this._callback.click(this._period);
  }

  getTemplate() {
    return createStatsTemplate(this._filmsInPeriod);
  }

  createCharts() {
    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    if (this._filmsInPeriod.length === 0) {
      const context = statisticCtx.getContext('2d');

      context.clearRect(0, 0, statisticCtx.width, statisticCtx.height);
      context.height = 0;
      return null;
    }

    statisticCtx.height = BAR_HEIGHT * this._genres.length;

    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: this._genres.map((item) => item[0]),
        datasets: [{
          data: this._genres.map((item) => item[1]),
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
  }
}
