const FavorecidosController = require('../favorecidos.controller');
const FavorecidosCollection = require('../favorecidos.collection');

jest.mock('../favorecidos.collection');

describe('Favorecidos controller test', () => {

    const res = {
        send: jest.fn()
    };

    const id = '1111111111111111';

    const body = {
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

    beforeEach(() => {

        FavorecidosCollection.mockClear();
    });

    it('should call getCollection', () => {

        FavorecidosController.getCollection();

        expect(FavorecidosCollection).toHaveBeenCalled();
    });

    it('should call getAll with pagination params', async () => {

        const req = {
            query: {
                page: 1,
                perPage: 10
            }
        };

        await FavorecidosController.getAll(req, res);

        const mockedCollectionInstance = FavorecidosCollection.mock.instances[0];

        expect(mockedCollectionInstance.getAll).toBeCalledWith(1, 10, undefined);
        expect(res.send).toHaveBeenCalled();
    });

    it('should call getAll with pagination and search params', async () => {

        const req = {
            query: {
                page: 1,
                perPage: 10,
                search: 'nome'
            }
        };

        await FavorecidosController.getAll(req, res);

        const mockedCollectionInstance = FavorecidosCollection.mock.instances[0];

        expect(mockedCollectionInstance.getAll).toBeCalledWith(1, 10, 'nome');
        expect(res.send).toHaveBeenCalled();
    });

    it('should call getOne with an record id', async () => {

        const req = {
            params: {
                id
            }
        };

        await FavorecidosController.getOne(req, res);

        const mockedCollectionInstance = FavorecidosCollection.mock.instances[0];

        expect(mockedCollectionInstance.getOne).toBeCalledWith(id);
        expect(res.send).toHaveBeenCalled();
    });

    it('should call upsert without a record id', async () => {

        const req = {
            body,
            params: {}
        };

        await FavorecidosController.upsert(req, res);

        const mockedCollectionInstance = FavorecidosCollection.mock.instances[0];

        expect(mockedCollectionInstance.upsert).toBeCalledWith(undefined, body);
        expect(res.send).toHaveBeenCalled();
    });

    it('should call upsert with a record id', async () => {

        const req = {
            body,
            params: {
                id
            }
        };

        await FavorecidosController.upsert(req, res);

        const mockedCollectionInstance = FavorecidosCollection.mock.instances[0];

        expect(mockedCollectionInstance.upsert).toBeCalledWith(id, body);
        expect(res.send).toHaveBeenCalled();
    });

    it('should call deleteOne with a record id', async () => {

        const req = {
            params: {
                id
            }
        };

        await FavorecidosController.deleteOne(req, res);

        const mockedCollectionInstance = FavorecidosCollection.mock.instances[0];

        expect(mockedCollectionInstance.deleteOne).toBeCalledWith(id);
        expect(res.send).toHaveBeenCalled();
    });

    it ('should call deleteMany with an array of records ids', async () => {

        const ids = ['1111111111111111', '2222222222222222'];
        const req = {
            body: {
                ids
            }
        };

        await FavorecidosController.deleteMany(req, res);

        const mockedCollectionInstance = FavorecidosCollection.mock.instances[0];

        expect(mockedCollectionInstance.deleteMany).toBeCalledWith(ids);
        expect(res.send).toHaveBeenCalled();
    });
});