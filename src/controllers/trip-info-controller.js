import TripInfoComponent from "../components/trip-info.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";


export default class TripInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._events = null;

    this._tripInfoComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const oldTripInfoComponent = this._tripInfoComponent;

    this._events = this._eventsModel.getEventsAll().slice();

    if (this._events.length === 0) {
      if (this._tripInfoComponent) {
        this._tripInfoComponent.hide();
      }
      return;
    }

    this._tripInfoComponent = new TripInfoComponent(this._events);

    if (oldTripInfoComponent) {
      replace(oldTripInfoComponent, this._tripInfoComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTER_BEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
