import EditFormComponent from "../components/edit-event";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventComponent from "../components/trip-event";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, replace, RenderPosition} from "../utils/render";


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

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const showingEvents = events.slice();
  console.log(`im here`);
  // отмена рендеринга Trip day Info при выборе недефолтного типа сортировки
  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = showingEvents;
      break;
    case SortType.TIME:
      sortedEvents = showingEvents.sort((a,b) => a.duration - b.duration);
      break;
    case SortType.PRICE:
      sortedEvents = showingEvents.sort((a,b) => b.price - a.price);
      break;
  }

  return sortedEvents;
}

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

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    const tripEventsListElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);

    events
      .forEach((event) => {
        renderEvent(tripEventsListElement, event);
        this._totalPrice = this._totalPrice + event.price;
      });

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);

      tripEventsListElement.innerHTML = ``;

      sortedEvents
        .forEach((event) => {
          renderEvent(tripEventsListElement, event);
        });
    });
  }
}
