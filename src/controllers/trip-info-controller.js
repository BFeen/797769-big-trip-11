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
    const oldTripInfoComponent = this._tripInfoComponent;
    console.log(`render tripInfo`);

    this._events = this._eventsModel.getEvents().slice();
    
    console.log(this._events)

    if (this._events.length === 0) {
      console.log(`nothing`)
      if (oldTripInfoComponent) {
        // remove(oldTripInfoComponent);
        // oldTripInfoComponent = null;
        // почему-то случается ошибка удаления  при этих условиях
      }
      return;
    }

    this._tripInfoComponent = new TripInfoComponent(this._events);

    if (oldTripInfoComponent) {
      console.log(`replace`)
      console.log(oldTripInfoComponent)
      replace(oldTripInfoComponent, this._tripInfoComponent);
    } else {
      console.log(`render`)
      render(this._container, this._tripInfoComponent, RenderPosition.AFTER_BEGIN);
    }
  }

  _rerender() {
    this.render();
  }

  _onDataChange() {
    this._rerender();
  }
}
