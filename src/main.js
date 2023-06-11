import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import NewPointButtonPresenter from './presenter/button-point-new-presenter.js';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsApiService from './api-services/points-api-service.js';
import DestinationsApiService from './api-services/destinations-api-service.js';
import OffersApiService from './api-services/offers-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';


const mainElement = document.querySelector('.page-main');
const menuContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();


const filterPresenter = new FilterPresenter({
  filtersContainer: menuContainer.querySelector('.trip-controls__filters'),
  pointsModel: pointsModel,
  filterModel: filterModel
});
filterPresenter.init();

const tripPresenter = new TripPresenter({
  tripInfoContainer: menuContainer.querySelector('.trip-main__trip-info'),
  tripContainer: mainElement.querySelector('.trip-events'),
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});

tripPresenter.init();

const newPointButtonPresenter = new NewPointButtonPresenter({
  newPointButtonContainer: menuContainer,
  destinationsModel: destinationsModel,
  offersModel: offersModel,
  boardPresenter: tripPresenter
});

newPointButtonPresenter.init();

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      newPointButtonPresenter.renderNewPointButton();
    });
  });
});

tripPresenter.init();
