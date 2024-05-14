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
