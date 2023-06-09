import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListTextType } from '../const.js';

const createEmptyListTemplate = (filterType) => `<p class="trip-events__msg">${EmptyListTextType[filterType]}</p>`;

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}

