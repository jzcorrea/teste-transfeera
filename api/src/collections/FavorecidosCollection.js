const ConnectionService = require('../services/ConnectionService');

module.exports = class FavorecidosCollection {

    constructor() {

        this._collection = 'favorecidos';
    }

    get connectionService() {

        if (!this._connectionService) {

            this._connectionService = new ConnectionService();
        }

        return this._connectionService;
    }

    async getAll() {

        const collection = await this.connectionService.getCollection(this._collection);

        return collection.find().toArray();
    }
};