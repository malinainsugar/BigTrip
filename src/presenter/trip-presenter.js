import { render, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { filtrate, sorting } from '../processing.js';
import SortView  from '../view/sort-view.js';
import TripListView  from '../view/trip-list-view.js';
import EmptyListView  from '../view/empty-list-view.js';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';


export default class TripPresenter {

  #tripListComponent = new TripListView();
  #tripContainer = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #pointsModel = null;
  #EmptyListComponent = null;

  #sortComponent = null;
  #currentSortType = SortType.DAY;

  #filterModel = null;
  #filterType = FilterType.EVERYTHING;

  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#pointsModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderTrip();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filtrate[this.#filterType](this.#pointsModel.points);

    sorting[this.#currentSortType](filteredPoints);
    return filteredPoints;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripList();
        this.#renderTripList();
        break;
      case UpdateType.MAJOR:
        this.#clearTripList({resetSortType: true});
        this.#renderTripList();
        break;
    }
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderFirstMessage = () => render(new EmptyListView(), this.#tripContainer);

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTripList();
    this.#renderTripList();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderTripList = () => {
    this.#renderSort();
    render(this.#tripListComponent, this.#tripContainer);
    this.#renderPoints(this.points);
  };

  #renderTrip() {
    const points = this.points;

    if (points.length === 0) {
      this.#renderFirstMessage();
      return;
    }

    this.#renderTripList();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#tripListComponent.element, this.#pointsModel, this.#handleViewAction, this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = (points) => points.forEach((point) => this.#renderPoint(point));

  #clearTripList = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#EmptyListComponent) {
      remove(this.#EmptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}

