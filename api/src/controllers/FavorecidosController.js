const FavorecidosCollection = require('../collections/FavorecidosCollection');

module.exports = class FavorecidosController {

    static async getAll(req, res) {

        const collection = new FavorecidosCollection();

        return res.send(await collection.getAll());
    }
};