import { render, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #points = null;
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor(tripInfoContainer, destinationsModel, offersModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (points) => {
    this.#points = points;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#tripInfoComponent = new TripInfoView(this.#points, this.#destinations, this.#offers);

    render(this.#tripInfoComponent, this.#tripInfoContainer);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
  };
}

