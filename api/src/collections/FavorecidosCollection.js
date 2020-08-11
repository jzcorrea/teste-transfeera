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

    static getSearchFilter(search) {

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
        const filter = FavorecidosCollection.getSearchFilter(search);

        return collection.find(filter).sort({
            name: 1
        }).skip((page - 1) * perPage).limit(perPage).toArray();
    }

    async upsert(id, data) {

        const collection = await this.connectionService.getCollection(this._collection);

        return id ? collection.updateOne({
            _id: this.connectionService.getObjectId(id)
        }, data) : collection.insertOne(data);
    }

    async deleteOne(id) {

        const collection = await this.connectionService.getCollection(this._collection);

        return collection.deleteOne({
            _id: this.connectionService.getObjectId(id)
        });
    }

    async deleteMany(ids) {

        const collection = await this.connectionService.getCollection(this._collection);

        return collection.deleteMany({
            _id: {
                $in: ids.map(id => this.connectionService.getObjectId(id))
            }
        });
    }
};