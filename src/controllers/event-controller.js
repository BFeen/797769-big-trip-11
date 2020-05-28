import EditFormComponent from "../components/edit-event";
import EventModel from "../models/event.js";
import {EmptyDestination} from "../const.js";
import {createOfferType} from "../utils/common.js";
import TripEventComponent from "../components/trip-event";
import {render, replace, remove, RenderPosition} from "../utils/render";


const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  type: `flight`,
  destination: EmptyDestination,
  price: 0,
  totalPrice: 0,
  dateStart: new Date(),
  dateEnd: new Date(),
  selectedOffers: [],
  isFavorite: false,
};

const parseFormData = (formData, offersAll, destinationsAll) => { // вали в event-controller
  const type = formData.get(`event-type`);
  const destination = destinationsAll.find((item) => item.name === formData.get(`event-destination`));
  const isFavorite = formData.get(`event-favorite`) === `on`;

  const availableOffers = offersAll.find((item) => item.type === type);
  const {offers} = availableOffers;
  const selectedOffers = [];

  for (const key of formData.keys()) {
    if (key.startsWith(`event-offer`)) {
      const currentOffer = key.substring(12);
      const index = offers.findIndex((item) => createOfferType(item.title) === currentOffer);
      selectedOffers.push(offers[index]);
    }
  }

  return new EventModel({
    "id": formData.get(`event-id`),
    "type": type,
    "destination": destination,
    "base_price": Number(formData.get(`event-price`)),
    "date_from": new Date(formData.get(`event-start-time`)),
    "date_to": new Date(formData.get(`event-end-time`)),
    "offers": selectedOffers,
    "is_favorite": isFavorite,
  });
};

export default class EventController {
  constructor(container, offers, destinations, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._offers = offers.slice();
    this._destinations = destinations.slice();

    this._mode = Mode.DEFAULT;
    this._tripEventComponent = null;
    this._editFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._tripEventComponent;
    const oldEventEditComponent = this._editFormComponent;
    this._mode = mode;

    this._tripEventComponent = new TripEventComponent(event);
    this._editFormComponent = new EditFormComponent(event, this._offers, this._destinations, this._mode);
    this._tripEventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._editFormComponent.setCloseEditButtonClickHandler(() => {
      this._mode = Mode.DEFAULT;
      this._replaceEditToEvent();
    });

    this._editFormComponent.setFavoriteButtonClickHandler(() => {
      const newEvent = EventModel.clone(event);
      // newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent, false);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._editFormComponent.disablingSaveButton();
      const formData = this._editFormComponent.getData();
      const data = parseFormData(formData, this._offers, this._destinations);

      this._onDataChange(this, event, data);
    });

    this._editFormComponent.setDeleteButtonClickHandler(() => {
      if (this._mode === Mode.ADDING) {
        remove(this._editFormComponent);
        this._onDataChange(this, EmptyEvent, null);
      } else {
        this._editFormComponent.disablingDeleteButton();
        this._onDataChange(this, event, null);
      }
      this._mode = Mode.DEFAULT;
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(oldEventComponent, this._tripEventComponent);
          replace(oldEventEditComponent, this._editFormComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._tripEventComponent, RenderPosition.BEFORE_END);
        }
        break;
      case Mode.EDIT:
        this._replaceEventToEdit();
        replace(oldEventComponent, this._tripEventComponent);
        replace(oldEventEditComponent, this._editFormComponent);
        break;
      case Mode.ADDING:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        this._editFormComponent.applyFlatpicr();
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container.firstChild, this._editFormComponent, RenderPosition.AFTER_END);
        break;
    }
  }

  destroy() {
    remove(this._editFormComponent);
    remove(this._tripEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._editFormComponent.getElement().classList.add(`shake`);
    this._editFormComponent.getElement().classList.add(`box-error`);

    setTimeout(() => {
      this._editFormComponent.getElement().classList.remove(`shake`);
      this._editFormComponent.getElement().classList.remove(`box-error`);
      this._editFormComponent.enablingForm();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    if (document.contains(this._tripEventComponent.getElement())) {
      replace(this._tripEventComponent, this._editFormComponent);
    }
    this._onViewChange();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._editFormComponent.applyFlatpicr();
  }

  _replaceEditToEvent() {
    this._editFormComponent.reset();

    if (document.contains(this._editFormComponent.getElement())) {
      replace(this._editFormComponent, this._tripEventComponent);
    }
    this._editFormComponent.destroyFlatpicr();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
    }
  }
}
