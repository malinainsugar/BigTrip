import {createElement} from '../render';

const createTripListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class TripList {
  get template() {
    return createTripListTemplate();
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


export default TripList;
