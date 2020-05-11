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
        .sort((a,b) => (b.dateEnd - b.dateStart) - (a.dateEnd - a.dateStart));
      break;
    case SortType.PRICE:
      sortedEvents = showingEvents
        .sort((a,b) => b.totalPrice - a.totalPrice);
      break;
  }

  return sortedEvents;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._totalPrice = 0;
  }

  render(events) {
    const container = this._container.getElement();
    let days = getDays(events);

    if (events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.AFTERBEGIN);

    const tripDaysComponent = new TripDaysComponent();
    render(container, tripDaysComponent, RenderPosition.BEFOREEND);
    
    let counter = 1;
    const tripEventsListElements = [];
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

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);

      const tripEventsListElement = tripDaysComponent.getElement().querySelector(`.trip-events__list`);

      sortedEvents
        .forEach((event) => {
          renderEvent(tripEventsListElement, event);
        });
    });
  }
}
