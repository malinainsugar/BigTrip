import { generatePoint, generateDestination, generateOffersByType } from '../mock/point';


export default class PointsModel {
  constructor() {
    this._points = Array.from({length: 10}, generatePoint);
    this._offers = generateOffersByType;
    this._destinations = generateDestination;
  }

  get points() {
    return this._points;
  }
}

