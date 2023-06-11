import { render, replace, remove } from '../framework/render.js';
import { filtrate } from '../utils.js';
import { FilterType, UpdateType } from '../const.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #filtersComponent = null;

  #filterModel = null;
  #pointsModel = null;

  constructor({filtersContainer, pointsModel, filterModel}) {
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
        name: FilterType.EVERYTHING,
        isEmpty:  filtrate[FilterType.EVERYTHING](points).length === 0,
      },
      {
        name: FilterType.FUTURE,
        isEmpty:  filtrate[FilterType.FUTURE](points).length === 0,
      },
      {
        name: FilterType.PAST,
        isEmpty:  filtrate[FilterType.PAST](points).length === 0,
      },
    ];
  }

  init = () => {
    const previousFilterComponent = this.#filtersComponent;
    this.#filtersComponent = new FilterView(this.filters, this.#filterModel.filter, this.#handleFilterClick);


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

