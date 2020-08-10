const { MongoClient } = require('mongodb');
const configs = require('../common/configs');

module.exports = class ConnectionService {

    constructor() {

        this._db = null;
    }

    async getDb() {

        if (this._db) {

            return Promise.resolve(this._db);
        }

        return MongoClient.connect(configs.mongodb.url, {
            useUnifiedTopology: true
        }).then(connection => {

            this._db = connection.db(process.env.MONGO_DB || 'transfeera');

            return this._db;
        });
    }

    async getCollection(collection) {

        const db = await this.getDb();

        return db.collection(collection);
    }
};