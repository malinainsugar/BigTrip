import AbstractView from '../framework/view/abstract-view.js';


const createNoAdditionalInfoTemplate = () => (
  `<p class="trip-events__msg">
  Sorry, there was an error loading the data
  </p>`);

export default class NoAdditionalInfoView extends AbstractView {
  get template() {
    return createNoAdditionalInfoTemplate();
  }
}

