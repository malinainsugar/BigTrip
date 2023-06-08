
export default class PointsModel {

  init(points, destinations, offers) {
    this._points = points;
    this._destinations = destinations;
    this._offers = offers;
  }

  get points() {
    return this._points;
  }

  get destinations() {
    return this._destinations;
  }

  get offers() {
    return this._offers;
  }
}

