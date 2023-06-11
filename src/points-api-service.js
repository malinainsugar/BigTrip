import ApiService from './framework/api-service.js';
import { Method } from './const.js';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  async addPoint(point) {
    return await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then(ApiService.parseResponse);
  }

  async deletePoint(point) {
    return await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  async updatePoint(point) {
    return await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then(ApiService.parseResponse);
  }

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': new Date(point.dateFrom).toISOString(),
      'date_to': new Date(point.dateTo).toISOString(),
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}

