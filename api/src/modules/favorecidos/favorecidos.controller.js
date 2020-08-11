const FavorecidosCollection = require('./favorecidos.collection');

module.exports = class FavorecidosController {

    static getCollection() {

        return new FavorecidosCollection();
    }

    static async getAll(req, res) {

        const {
            page,
            perPage,
            search
        } = req.query;
        const results = await FavorecidosController.getCollection().getAll(page, perPage, search);

        return res.send(results);
    }

    static async getOne(req, res) {

        const {
            params
        } = req;
        const result = await FavorecidosController.getCollection().getOne(params.id);

        return res.send(result);
    }

    static async upsert(req, res) {

        const {
            params,
            body
        } = req;
        const result = await FavorecidosController.getCollection().upsert(params.id, body);

        return res.send(result);
    }

    static async deleteOne(req, res) {

        const {
            params
        } = req;
        const result = await FavorecidosController.getCollection().deleteOne(params.id);

        return res.send(result);
    }

    static async deleteMany(req, res) {

        const {
            body
        } = req;
        const results = await FavorecidosController.getCollection().deleteMany(body.ids);

        return res.send(results);
    }
}