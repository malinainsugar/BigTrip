import Observable from '../framework/observable';
import { generatePoint } from '../mock/point-mock';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    super();

    for (let i = 0; i < 10; i++) {
      this.#points.push(generatePoint(i));
    }
  }

  init(points, destinations, offers) {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }


  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      return;
    }

    this.#points = [...this.#points.slice(0, index), update, ...this.#points.slice(index + 1)];
    this._notify(updateType, update);
  }

  addPoint = (updateType, update) => {
    this.#points = [update, ...this.#points];
    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      return;
    }

    this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];

    this._notify(updateType, update);
  }
}

