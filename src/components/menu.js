import AbstractComponent from "./abstract-component.js";


const ACTIVE_CLASS = `trip-tabs__btn--active`;

export const MenuItem = {
  TABLE: `control__table`,
  STATISTICS: `control__statistics`,
}

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a id="control__table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
            <a id="control__statistics" class="trip-tabs__btn" href="#">Stats</a>
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

  getActiveItem() {
    return this._activeItem;
  }

  setActiveItem(menuItem) {
    const item = this.getTemplate().querySelector(`#${menuItem}`);

    if (item) {
      item.classList.toggle(ACTIVE_CLASS);
    }
  }

  // setOpenTableHandler(handler) {
  //   if (this._activeItem === MenuItem.TABLE) {
  //     return;
  //   }
  //   const table = this.getElement().querySelector(`#${MenuItem.TABLE}`);
  //   table.classList.toggle(ACTIVE_CLASS);
  //   table.addEventListener(`click`, handler);
  // }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id

      handler(menuItem);
    });
  }
}
