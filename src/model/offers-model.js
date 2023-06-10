import Observable from '../framework/observable.js';

export default class OffersModel extends Observable{
  #offers = [];
  #offersApiService = null;

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
  };

  get offers() {
    return this.#offers;
  }
}

