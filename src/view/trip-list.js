import {createElement} from '../render';

const createFiltersTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class TripList {
  getTemplate() {
    return createFiltersTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}


export default TripList;
