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

    getSearchFilter(search) {

        if (!search) {

            return {};
        }

        const re = new RegExp(search, 'i');

        return search ? {
            $or: [{
                name: re
            }, {
                cpf_cnpj: re
            }, {
                agency: re
            }, {
                account: re
            }]
        } : {};
    }

    async getAll(page, perPage, search) {

        const collection = await this.connectionService.getCollection(this._collection);
        const filter = this.getSearchFilter(search);

        return collection.find(filter).sort({ name: 1 }).skip((page - 1) * perPage).limit(perPage).toArray();
    }
};