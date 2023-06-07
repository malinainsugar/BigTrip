import { render } from '../framework/render.js';
import { generateSorting } from '../mock/processing.js';
import { updateItem } from '../utils';
import Point from '../view/point.js';
import Sort from '../view/sort.js';
import TripList from '../view/trip-list.js';
import EmptyList from '../view/empty-list.js';
import PointPresenter from './point-presenter';


export default class TripPresenter {
  constructor(container, pointsModel) {
    this._tripListComponent = new TripList();
    this._container = container;
    this._pointsModel = pointsModel;
    this._pointPresenter = new Map();
  }

  init() {
    this._listPoints = [...this._pointsModel.points];
    this._renderTrip();
  }

  _handlePointChange = (updatedPoint) => {
    this._listPoints = updateItem(this._listPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange = () => this._pointPresenter.forEach((presenter) => presenter.resetView());

  _renderFirstMessage = () => render(new EmptyList(), this._container);

  _renderSort = () => {
    const sorting = generateSorting(this._pointsModel.points);
    render(new Sort(sorting), this._container);
  }

  _renderNewPoint = () => render(new Point(this._pointsModel.getOffers(), this._pointsModel.getDestination()), this._tripListComponent.element);

  _renderPoints = () => this._listPoints.forEach((point) => this._renderPoint(point));

  _renderTripList = () => {
    render(this._tripListComponent, this._container);
    this._renderPoints();
  }

  _renderTrip() {
    if (this._listPoints.length === 0) {
      this._renderFirstMessage();
      return;
    }

    this._renderSort();
    this._renderTripList();
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent.element, this._pointsModel, this._handlePointChange, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _clearPointList = () => {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }
}

