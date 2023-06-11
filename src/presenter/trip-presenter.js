import { RenderPosition, render, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit } from '../const';
import { filtrate, sorting } from '../processing.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView  from '../view/sort-view.js';
import TripListView  from '../view/trip-list-view.js';
import EmptyListView  from '../view/empty-list-view.js';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';
import LoadingView from '../view/loading-view.js';
import NoAdditionalInfoView from '../view/no-additional-info-view.js';
import TripInfoPresenter from './trip-info-presenter.js';


export default class TripPresenter {

  #tripListComponent = new TripListView();
  #loadingComponent = new LoadingView();
  #noAdditionalInfoComponent = new NoAdditionalInfoView();
  #tripContainer = null;
  #tripInfoContainer = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #tripInfoPresenter = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #emptyListComponent = null;

  #isLoading = true;

  #sortComponent = null;
  #currentSortType = SortType.DAY;

  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor({tripInfoContainer, tripContainer, pointsModel, filterModel, destinationsModel, offersModel}) {
    this.#tripContainer = tripContainer;
    this.#tripInfoContainer = tripInfoContainer;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointNewPresenter = new PointNewPresenter({
      pointListContainer: this.#tripListComponent.element,
      changeData: this.#handleViewAction,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripList();
        this.#clearTripInfo();
        this.#renderTripInfo();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTripList({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        this.#renderTripInfo();
        break;
    }
  };

  #renderTripInfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter(this.#tripInfoContainer, this.#destinationsModel, this.#offersModel);
    const sortedPoints = sorting[SortType.DAY](this.points);
    this.#tripInfoPresenter.init(sortedPoints);
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#emptyListComponent) {
      render(this.#tripListComponent, this.#tripContainer);
    }
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
    this.#renderTrip();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderTripList = (points) => {
    this.#renderSort();
    render(this.#tripListComponent, this.#tripContainer);
    this.#renderPoints(points);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.BEFOREEND);
  };

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#offersModel.offers.length === 0 || this.#destinationsModel.destinations.length === 0) {
      this.#renderNoAdditionalInfo();
      return;
    }


    const points = this.points;

    if (points.length === 0) {
      this.#renderFirstMessage();
      return;
    }

    this.#renderTripList(points);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      dataChange: this.#handleViewAction,
      modeChange: this.#handleModeChange,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderNoAdditionalInfo = () => {
    render(this.#noAdditionalInfoComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (points) => points.forEach((point) => this.#renderPoint(point));

  #clearTripList = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #clearTripInfo = () => {
    this.#tripInfoPresenter.destroy();
  };
}

