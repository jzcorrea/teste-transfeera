const request = require('supertest');
const {
    MongoClient,
    ResumeToken
} = require('mongodb');
const app = require('../../../../app');
const configs = require('../../../common/configs');
const records = require('../../../../assets/e2e-test-records.json');

describe('Favorecidos controller integration tests', () => {

    let id = null;
    let idsToRemove = [];

    beforeAll(async () => {

        id = null;

        const connection = await MongoClient.connect(configs.mongodb.url, configs.mongodb.options);
        const db = connection.db('transfeera');
        const collection = db.collection('favorecidos');
        const {
            ops
        } = await collection.insertMany(records.for_crud);

        idsToRemove = ops.map(record => record._id);
    });

    it('should call getAll without pagination query', async done => {

        const res = await request(app).get('/favorecidos');
        const content = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(content.length).toBeLessThanOrEqual(10);
        done();
    });

    it('should call getAll with pagination query', async done => {

        const perPage = 15;
        const res = await request(app).get(`/favorecidos?page=1&perPage=${perPage}`);
        const content = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(content.length).toBeLessThanOrEqual(perPage);
        done();
    });

    it('should call getAll with a existing search query', async done => {

        const res = await request(app).get('/favorecidos?search=josé');
        const content = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(content.length).toBeGreaterThan(0);
        done();
    });

    it('should call getAll with a no existing search query', async done => {

        const res = await request(app).get('/favorecidos?search=nome');
        const content = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(content.length).toBe(0);
        done();
    });

    it('should call create with an invalid agency digit and return error', async done => {

        const res = await request(app).post('/favorecidos').send(records.for_wrong_agency_digit);

        expect(res.statusCode).toBe(400);
        done();
    });

    it('should call create with an invalid account type and return error', async done => {

        const res = await request(app).post('/favorecidos').send(records.for_wrong_account_type);

        expect(res.statusCode).toBe(400);
        done();
    });

    it('should call create and create a new record', async done => {

        const res = await request(app).post('/favorecidos').send(records.for_creating);
        const result = JSON.parse(res.text);

        id = result.ops[0]._id;

        expect(res.statusCode).toBe(200);
        expect(result.ops.length).toBe(1);
        expect(result.ops[0].status).toBe('draft');
        done();
    });

    it('should call getOne with an id and return one record', async done => {

        const res = await request(app).get(`/favorecidos/${id}`);
        const content = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(content.status).toBe('draft');
        done();
    });

    it('should call update and update an existing record by id', async done => {

        const updates = {
            ...records.for_creating
        };
        updates.email = 'teste.integracao@transfeera.com';

        const res = await request(app).put(`/favorecidos/${id}`).send(updates);
        const result = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(result.nModified).toBe(1);
        done();
    });

    it('should call deleteOne and remove an existing record by id', async done => {

        const res = await request(app).delete(`/favorecidos/one/${id}`);
        const result = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
        done();
    });

    it('should call deleteMany and remove all the records with received ids', async done => {

        const res = await request(app).delete(`/favorecidos/many`).send({
            ids: idsToRemove
        });
        const result = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(2);
        done();
    });
});