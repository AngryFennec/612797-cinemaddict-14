import AbstractView from './abstract-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserRank, getDuration, getMostPopularGenre, getGenresCount} from '../utils/common';


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
           id="statistic-all-time" value="all-time" checked>
      <label htmlFor="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
             id="statistic-today" value="today">
        <label htmlFor="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
               id="statistic-week" value="week">
          <label htmlFor="statistic-week" class="statistic__filters-label">Week</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
                 id="statistic-month" value="month">
            <label htmlFor="statistic-month" class="statistic__filters-label">Month</label>

            <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
                   id="statistic-year" value="year">
              <label htmlFor="statistic-year" class="statistic__filters-label">Year</label>
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

  constructor(films) {
    super();
    this._watchedFilms = films.filter((item) => item.userDetails.alreadyWatched);
    this._genres = getGenresCount(this._watchedFilms);
    this._init();

  }

  _init() {
    if (this._watchedFilms.length > 0) {
      this.createCharts();
    }
    getMostPopularGenre(this._watchedFilms);
  }

  getTemplate() {
    return createStatsTemplate(this._watchedFilms);
  }


  createCharts() {
    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

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
