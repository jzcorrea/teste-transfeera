const FavorecidosCollection = require('../collections/FavorecidosCollection');

module.exports = class FavorecidosController {

    static async getAll(req, res) {

        const collection = new FavorecidosCollection();
        const { page, perPage } = req.query; 

        return res.send(await collection.getAll(page, perPage));
    }

    static async upsert(req, res) {

    }

    static async remove(req, res) {


    }

    static async removeMany(req, res) {


    }
}