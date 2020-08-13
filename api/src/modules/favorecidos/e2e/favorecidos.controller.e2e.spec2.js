const request = require('supertest');
const app = require('../../../../app');
const ConnectionService = require('../../../services/connection.service');

describe('Favorecidos controller test', () => {

    it('should call getAll without pagination query', done => {

        request(app).get('/favorecidos').then(res => {

            const content = JSON.parse(res.text);

            expect(res.statusCode).toBe(200);
            expect(content.length).toBeLessThanOrEqual(10);
            done();
        });
    });

    it('should call getAll with pagination query', done => {

        const perPage = 15;

        request(app).get(`/favorecidos?page=1&perPage=${perPage}`).then(res => {

            const content = JSON.parse(res.text);

            expect(res.statusCode).toBe(200);
            expect(content.length).toBeLessThanOrEqual(perPage);
            done();
        });
    });

    it('should call getAll with a existing search query', done => {

        request(app).get('/favorecidos?search=josé').then(res => {

            const content = JSON.parse(res.text);

            expect(res.statusCode).toBe(200);
            expect(content.length).toBeGreaterThan(0);
            done();
        });
    });

    it('should call getAll with a no existing search query', done => {

        request(app).get('/favorecidos?search=nome').then(res => {

            const content = JSON.parse(res.text);

            expect(res.statusCode).toBe(200);
            expect(content.length).toBe(0);
            done();
        });
    });

    it('should call create and create a new record', done => {

        const favorecido = {
            name: 'José Silva',
            email: 'jose.silva@gmail.com',
            cpf_cnpj: '029.192.211-09',
            bank: '001',
            agency: '4742',
            agency_digit: null,
            account: '17021',
            account_digit: '3',
            account_type: 'CONTA_CORRENTE'
        };

        request(app).post('/favorecidos').send(favorecido).then(res => {

            const result = JSON.parse(res.text);

            expect(res.statusCode).toBe(200);
            expect(result.ops.length).toBe(1);
            expect(result.ops[0].status).toBe('draft');
            done();
        });
    });

    it ('should call update and update an existing record', done => {

        let id = null;
        const cnpjToValidate = '109.876.543-21';
        const favorecido = {
            name: 'Pedro Sousa',
            email: 'pedro.sousa@gmail.com',
            cpf_cnpj: '123.456.789-10',
            bank: '001',
            agency: '1111',
            agency_digit: null,
            account: '12017',
            account_digit: '6',
            account_type: 'CONTA_CORRENTE'
        };

        request(app).post('/favorecidos').send(favorecido).then(res => {

            const result = JSON.parse(res.text);
            id = result.ops[0]._id;

            favorecido.cpf_cnpj = cnpjToValidate;

            return request(app).put(`/favorecidos/${id}`).send(favorecido);
        }).then(res => {

            const result = JSON.parse(res.text);

            expect(res.statusCode).toBe(200);
            expect(result.nModified).toBe(1);

            done();
        });
    });
});