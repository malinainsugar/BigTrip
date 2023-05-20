import { generatePoint } from '../mock/point';

export default class PointsModel {
  constructor() {
    this.points = Array.from({length: 10}, generatePoint);
  }

  getPoints() {
    return this.points;
  }
}

