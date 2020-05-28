import AbstractSmartComponent from "./abstract-smart-component.js";
import {getPrepositionFromType} from "../utils/common.js";
import {EventTypes} from "../const.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";


const BAR_HEIGHT = 55;

const Postfixes = {
  "MONEY": `€`,
  "TRANSPORT": `x`,
  "TIME_SPEND": `H`,
};

const getTypesFromEvents = (events) => {
  return events.map((event) => {
    const preposition = getPrepositionFromType(event.type);
    return `${event.type} ${preposition} ${event.destination.name}`.toUpperCase();
  });
};

const getUniqueTypes = (events) => {
  return [...new Set(events.map((item) => item.type.toUpperCase()))];
};

const getUniqueTransferTypes = (events) => {
  let uniqueList = new Set();
  for (let event of events) {
    if (EventTypes.TRANSFER.includes(event.type)) {
      uniqueList.add(event.type.toUpperCase());
    }
  }
  return [...uniqueList];
};

const countPrices = (events, eventTypes) => {
  return eventTypes
    .map((eventType) => {
      return events
        .filter((event) => event.type.toUpperCase() === eventType)
        .reduce((acc, item) => {
          return acc + item.totalPrice;
        }, 0);
    });
};

const countTransportTypes = (events, transferTypes) => {
  let counts = [];
  for (let item of transferTypes) {
    counts.push(events.filter((event) => event.type.toUpperCase() === item).length);
  }
  return counts;
};

const countDurationHours = (events) => {
  return events.map((event) => {
    return Math.floor(moment.duration(event.dateEnd - event.dateStart) / (1000 * 60 * 60));
  });
};

const generateData = (chartType, events) => {
  switch (chartType) {
    case `MONEY`:
      const uniqueTypes = getUniqueTypes(events);
      return {
        labels: uniqueTypes,
        counts: countPrices(events, uniqueTypes),
        postfix: Postfixes[chartType],
      };
    case `TRANSPORT`:
      const uniqueTransportTypes = getUniqueTransferTypes(events);
      return {
        labels: uniqueTransportTypes,
        counts: countTransportTypes(events, uniqueTransportTypes),
        postfix: Postfixes[chartType],
      };
    case `TIME_SPEND`:
      const uniqueEventTypes = getTypesFromEvents(events);
      return {
        labels: uniqueEventTypes,
        counts: countDurationHours(events, uniqueEventTypes),
        postfix: Postfixes[chartType],
      };
  }
  return false;
};

const renderChart = (ctx, chartName, events) => {
  const data = generateData(chartName, events);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.labels,
      datasets: [{
        data: data.counts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val} ${data.postfix}`
        }
      },
      title: {
        display: true,
        text: chartName,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`,
        padding: 70,
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
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
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

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  show() {
    super.show();
    this.getElement().classList.add(`statistics`);
    this.rerender(this._events);
  }

  rerender(events) {
    this._events = events;

    super.rerender();

    this._renderCharts();
  }

  hide() {
    super.hide();
    this.getElement().classList.remove(`statistics`);
  }

  recoveryListeners() {}

  _renderCharts() {
    const events = this._events.getEvents();
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();
    moneyCtx.height = BAR_HEIGHT * getUniqueTypes(events).length + 1;
    transportCtx.height = BAR_HEIGHT * getUniqueTransferTypes(events).length + 1;
    timeSpendCtx.height = BAR_HEIGHT * getTypesFromEvents(events).length + 1;

    this._moneyChart = renderChart(moneyCtx, `MONEY`, events);
    this._transportChart = renderChart(transportCtx, `TRANSPORT`, events);
    this._timeSpendChart = renderChart(timeSpendCtx, `TIME_SPEND`, events);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
