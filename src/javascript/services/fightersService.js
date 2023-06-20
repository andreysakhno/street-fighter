import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    #detailsEndpoint = '';

    get detailsEndpoint() {
        return this.#detailsEndpoint;
    }

    set detailsEndpoint(id) {
        this.#detailsEndpoint = `details/fighter/${id}.json`;
    }

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    /*
     *  Eslint, вимагає використання this у методах класу, якщо вони є асинхронними. Expected 'this' to be used by class async method 'getFighterDeta
     *  Тому замість, const endpoint = `details/fighter/${id}.json`; я додав setter та getter.
     *  Також можна було зробити цей метод статичним, або визначити метод callApi в цьому класі
     */
    async getFighterDetails(id) {
        this.detailsEndpoint = id;
        try {
            const apiResult = await callApi(this.detailsEndpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
