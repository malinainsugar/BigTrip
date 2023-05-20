import { createElement } from '../render.js';

const createEmptyListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class EmptyList {
  get template() {
    return createEmptyListTemplate();
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

