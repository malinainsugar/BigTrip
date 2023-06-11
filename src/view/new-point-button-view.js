import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = (isDisabled) => `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? 'disabled': ''}>New event</button>;`;

export default class NewPointButtonView extends AbstractView {
  #buttonClick = null;
  #isDisabled = false;

  constructor({ buttonClick, isDisabled }) {
    super();
    this.#buttonClick = buttonClick;
    this.#isDisabled = isDisabled;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate(this.#isDisabled);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#buttonClick();
  };
}
