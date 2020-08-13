const { MongoClient, ObjectID } = require('mongodb');
const configs = require('../common/configs');

module.exports = class ConnectionService {

    constructor() {

        this._db = null;
    }

    getObjectId(id) {

        return new ObjectID(id);
    }

    async getDb() {

        if (this._db) {

            return Promise.resolve(this._db);
        }

        return MongoClient.connect(configs.mongodb.url, configs.mongodb.options).then(connection => {

            this._db = connection.db(process.env.MONGO_DB || 'transfeera');

            return this._db;
        });
    }

    async getCollection(collection) {

        const db = await this.getDb();

        return db.collection(collection);
    }
};