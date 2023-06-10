import { render, replace, remove } from '../framework/render.js';
import { filtrate } from '../processing.js';
import { FilterType, UpdateType } from '../const.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filtersComponent = null;

  constructor(filtersContainer, filterModel, pointsModel) {
    this.#filtersContainer = filtersContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'EVERYTHING',
        count: filtrate[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.PAST,
        name: 'PAST',
        count: filtrate[FilterType.PAST](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'FUTURE',
        count: filtrate[FilterType.FUTURE](points).length,
      },
    ];
  }

  init() {
    const previousFilterComponent = this.#filtersComponent;
    this.#filtersComponent = new FilterView(this.filters, this.#filterModel.filter);
    this.#filtersComponent.setFilterChangeHandler(this.#handleFilterClick);


    if (!previousFilterComponent) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }
    replace(this.#filtersComponent, previousFilterComponent);
    remove(previousFilterComponent);

  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterClick = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

