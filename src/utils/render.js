const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  AFTER_END: `afterend`,
  BEFORE_END: `beforeend`,
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFORE_END:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTER_END:
      container.after(component.getElement());
      break;
  }
};

const replace = (oldComponent, newComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {RenderPosition, createElement, render, replace, remove};
