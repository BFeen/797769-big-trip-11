import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";


const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx) => {
  
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
        labels: [`FLY`, `STAY`, `DRIVE`, `LOOK`, `RIDE`],
        datasets: [{
            data: [400, 300, 200, 160 , 100],
            backgroundColor: `#ffffff`,
            hoverBackgroundColor: `#ffffff`,
            anchor: `start`
        }]
    },
    options: {
        plugins: {
            datalabels: {
                font: {
                    size: 13
                },
                color: `#000000`,
                anchor: 'end',
                align: 'start',
                formatter: (val) => `€ ${val}`
            }
        },
        title: {
            display: true,
            text: `MONEY`,
            fontColor: `#000000`,
            fontSize: 23,
            position: `left`
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: `#000000`,
                    padding: 5,
                    fontSize: 13,
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                barThickness: 44,
            }],
            xAxes: [{
                ticks: {
                    display: false,
                    beginAtZero: true,
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                minBarLength: 50
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false,
        }
    }
});
};

const renderTransportChart = (transportCtx) => {
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
        labels: [`FLY`, `DRIVE`,  `RIDE`],
        datasets: [{
            data: [4, 2, 1],
            backgroundColor: `#ffffff`,
            hoverBackgroundColor: `#ffffff`,
            anchor: `start`
        }]
    },
    options: {
        plugins: {
            datalabels: {
                font: {
                    size: 13
                },
                color: `#000000`,
                anchor: 'end',
                align: 'start',
                formatter: (val) => `${val}x`
            }
        },
        title: {
            display: true,
            text: `TRANSPORT`,
            fontColor: `#000000`,
            fontSize: 23,
            position: `left`
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: `#000000`,
                    padding: 5,
                    fontSize: 13,
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                barThickness: 44,
            }],
            xAxes: [{
                ticks: {
                    display: false,
                    beginAtZero: true,
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                minBarLength: 50
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false,
        }
    }
});
};

const renderTimeSpendChart = () => {
  return new Chart();
};

const createStatisticTemplate = () => {
  return (
    `<section class="">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent  {
  constructor({events}) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  show() {
    super.show();
    this.getElement().classList.add(`statistics`);
  }

  hide() {
    super.hide();
    this.getElement().classList.remove(`statistics`);
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistic__money`);
    const transportCtx = element.querySelector(`.statistic__transport`);
    const timeSpendCtx = element.querySelector(`.statistic__time-spend`); 

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._transportChart = renderTransportChart(transportCtx);
    // this._timeSpendChart = renderTimeSpendChart();
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null();
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null();
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null();
    }
  }
}
