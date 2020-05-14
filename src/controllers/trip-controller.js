import EditFormComponent from "../components/edit-event";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventComponent from "../components/trip-event";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, replace, RenderPosition} from "../utils/render";
import {formatDay} from "../utils/common.js";
import DayInfoComponent from "../components/day-info";


const renderEvent = (tripEventsListElement, event) => {
  const replaceEventToEdit = () => {
    replace(tripEventComponent, editFormComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceEditToEvent = () => {
    replace(editFormComponent, tripEventComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
    }
  };

  const tripEventComponent = new TripEventComponent(event);
  tripEventComponent.setEditButtonClickHandler(replaceEventToEdit);

  const editFormComponent = new EditFormComponent(event);
  editFormComponent.setCloseEditButtonClickHandler(replaceEditToEvent);

  render(tripEventsListElement, tripEventComponent, RenderPosition.BEFOREEND);
};

const renderDay = (tripDaysComponent, day, counter) => {
  const dayInfoComponent = new DayInfoComponent(day, counter);
  render(tripDaysComponent.getElement(), dayInfoComponent, RenderPosition.BEFOREEND);

  return dayInfoComponent.getElement().querySelector(`.trip-events__list`);
};

const renderDays = (tripDaysComponent, events) => {
  const days = getDays(events);
  const tripEventsListElements = [];
  let counter = 1;
  days
    .forEach((day) => {
      tripEventsListElements.push(renderDay(tripDaysComponent, day, counter++));
    });

  counter = 0;
  events
    .forEach((event) => {
      const eventDay = formatDay(event.dateStart);

      if (eventDay !== days[counter]) {
        counter++;
      }

      renderEvent(tripEventsListElements[counter], event);
    });
};

const getDays = (events) => {
  const days = [];

  for (const event of events) {
    const eventDay = formatDay(event.dateStart);
    if (!days.includes(eventDay)) {
      days.push(eventDay);
    }
  }

  return days;
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const showingEvents = events.slice();
  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = showingEvents;
      break;
    case SortType.TIME:
      sortedEvents = showingEvents
        .sort((a, b) => (b.dateEnd - b.dateStart) - (a.dateEnd - a.dateStart));
      break;
    case SortType.PRICE:
      sortedEvents = showingEvents
        .sort((a, b) => b.totalPrice - a.totalPrice);
      break;
  }

  return sortedEvents;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._totalPrice = 0;
  }

  render(events) {
    const container = this._container.getElement();

    if (events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    renderDays(this._tripDaysComponent, events);

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);

      this._tripDaysComponent.getElement().innerHTML = ``;

      if (sortType === SortType.EVENT) {
        renderDays(this._tripDaysComponent, sortedEvents);
      } else {
        const tripEventListElement = renderDay(this._tripDaysComponent);

        sortedEvents
          .forEach((event) => {
            renderEvent(tripEventListElement, event);
          });
      }
    });
  }
}
