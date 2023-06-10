import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsApiService from './api-services/points-api-service.js';
import DestinationsApiService from './api-services/destinations-api-service.js';
import OffersApiService from './api-services/offers-api-service.js';

const AUTHORIZATION = 'Basic 48gh589hfdg49grr';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

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
  tripContainer: mainElement.querySelector('.trip-events'),
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});

const newPointButtonComponent = new NewPointButtonView();

const newPointFormCloseHandle = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(newPointFormCloseHandle);
  newPointButtonComponent.element.disabled = true;
};

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      render(newPointButtonComponent, menuContainer);
      newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
    });
  });
});

tripPresenter.init();
