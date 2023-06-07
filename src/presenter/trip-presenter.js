import { render } from '../framework/render.js';
import { updateItem, sortByDay, sortByTime, sortByPrice } from '../utils';
import Point from '../view/point.js';
import Sort from '../view/sort.js';
import TripList from '../view/trip-list.js';
import EmptyList from '../view/empty-list.js';
import PointPresenter from './point-presenter';
import { SORT_TYPE } from '../const';


export default class TripPresenter {
  constructor(container, pointsModel) {
    this._tripListComponent = new TripList();
    this._container = container;
    this._pointsModel = pointsModel;
    this._pointPresenter = new Map();
    this._sortComponent = new Sort();
    this._currentSortType = SORT_TYPE.PRICE;
  }

  init() {
    this._listPoints = sortByPrice(this._pointsModel.points);
    this._renderTrip();
    this._sourcedListPoints = [...this._listPoints];
  }

  _handlePointChange = (updatedPoint) => {
    this._listPoints = updateItem(this._listPoints, updatedPoint);
    this._sourcedListPoints = updateItem(this._sourcedListPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange = () => this._pointPresenter.forEach((presenter) => presenter.resetView());

  _renderFirstMessage = () => render(new EmptyList(), this._container);

  _sortPoints = (sortType) => {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this._listPoints = sortByDay(this._listPoints);
        break;
      case SORT_TYPE.TIME:
        this._listPoints = sortByTime(this._listPoints);
        break;
      default:
        this._listPoints = sortByPrice(this._listPoints);
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange = (sortType) => {
    if (sortType === this._currentSortType){
      return;
    }

    this._sortPoints(sortType);
    this._clearPointList();
    this._renderPoints();
  }

  _renderSort = () => {
    render(this._sortComponent, this._container);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

