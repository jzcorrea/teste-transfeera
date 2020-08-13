const ConnectionService = require('../../services/connection.service');

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

    async getCollection() {

        return this.connectionService.getCollection(this._collection);
    }

    async getAll(page, perPage, search) {

        const filter = this.getSearchFilter(search);
        const collection = await this.getCollection();

        return collection.find(filter).sort({
            name: 1
        }).skip((page - 1) * perPage).limit(perPage).toArray();
    }

    async getOne(id) {

        const collection = await this.getCollection();

        return collection.findOne({
            _id: this.connectionService.getObjectId(id)
        });
    }

    async upsert(id, data) {

        const collection = await this.getCollection();

        return id ? collection.updateOne({
            _id: this.connectionService.getObjectId(id)
        }, { $set: data }) : collection.insertOne(data);
    }

    async deleteOne(id) {

        const collection = await this.getCollection();

        return collection.deleteOne({
            _id: this.connectionService.getObjectId(id)
        });
    }

    async deleteMany(ids) {

        const collection = await this.getCollection();

        return collection.deleteMany({
            _id: {
                $in: ids.map(this.connectionService.getObjectId)
            }
        });
    }
};