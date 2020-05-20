import AbstractComponent from "./abstract-component.js";


const ACTIVE_CLASS = `trip-tabs__btn--active`;

export const MenuItem = {
  TABLE: `trip-tabs__table`,
  STATISTICS: `trip-tabs__statistics`,
}

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a id="trip-tabs__table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
            <a id="trip-tabs__statistics" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class MenuComponent extends AbstractComponent {
  constructor() {
    super();

    this._activeItem = MenuItem.TABLE;
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    this.getElement().querySelectorAll(`a`).forEach((item) => {
      item.classList.toggle(ACTIVE_CLASS);
    });
    this._activeItem = menuItem;
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A` || evt.target.id === (this._activeItem)) {
        return;
      }

      const menuItem = evt.target.id
      handler(menuItem);
    });
  }
}
