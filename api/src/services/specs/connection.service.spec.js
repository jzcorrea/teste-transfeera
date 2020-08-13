const mongodb = require('mongodb');
const configs = require('../../common/configs');
const ConnectionService = require('../connection.service');

jest.mock('mongodb');

const mockedDb = {
    collection: jest.fn().mockResolvedValue('collection')
};

const mockedConnection = {
    db: jest.fn().mockReturnValue(mockedDb)
};

mongodb.MongoClient.connect = jest.fn().mockResolvedValue(mockedConnection);

describe('Connection service tests', () => {

    it('should call ObjectID with an id', () => {

        const id = '111111111111111111111111';
        const service = new ConnectionService();

        service.getObjectId(id);

        expect(mongodb.ObjectID).toBeCalledWith(id);
    });

    it ('should call connect and return a database connection', async () => {

        const service = new ConnectionService();

        await service.getDb();
        
        expect(mongodb.MongoClient.connect).toBeCalledWith(configs.mongodb.url, configs.mongodb.options);
        expect(mockedConnection.db).toBeCalledWith('transfeera');
    });

    it ('should call getCollection with collection name', async () => {

        const service = new ConnectionService();
        const collection = 'favorecidos';

        await service.getCollection(collection);

        expect(mockedDb.collection).toBeCalledWith(collection);
    });

    it ('should call connect only at first time', async () => {

        mongodb.MongoClient.connect.mockClear();

        const service = new ConnectionService();

        await service.getCollection('favorecidos');
        await service.getCollection('pagamentos');

        expect(mongodb.MongoClient.connect).toHaveBeenCalledTimes(1);
    });
});