const FavorecidosCollection = require('../collections/FavorecidosCollection');

module.exports = class FavorecidosController {

    static async getAll(req, res) {

        const collection = new FavorecidosCollection();
        const { page, perPage, search } = req.query; 

        return res.send(await collection.getAll(page, perPage, search));
    }

    static async upsert(req, res) {

        const { params, body } = req;
        const collection = new FavorecidosCollection();

        return res.send(await collection.upsert(params.id, body));
    }

    static async deleteOne(req, res) {

        const { params } = req;
        const collection = new FavorecidosCollection();

        return res.send(await collection.deleteOne(params.id));
    }

    static async deleteMany(req, res) {

        const { body } = req;
        const collection = new FavorecidosCollection();
        console.log(body);
        return res.send(await collection.deleteMany(body.ids));
    }
}