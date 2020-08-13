const {
    ObjectID
} = require('mongodb');
const FavorecidosCollection = require('../favorecidos.collection');
const ConnectionService = require('../../../services/connection.service');

const mockedCollection = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockResolvedValue('findOne'),
    insertOne: jest.fn().mockReturnThis(),
    updateOne: jest.fn().mockReturnThis(),
    deleteOne: jest.fn().mockReturnThis(),
    deleteMany: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue('toArray')
};

ConnectionService.prototype.getCollection = jest.fn().mockResolvedValue(mockedCollection);

describe('Favorecidos collection tests', () => {

    const id = '111111111111111111111111';
    const mongoObjectID = new ObjectID(id);

    const page = 1;
    
    const perPage = 10;
    
    const search = 'nome';
    
    const re = new RegExp(search, 'i');
    
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
    
    const filter = {
        $or: [{
            name: re
        }, {
            cpf_cnpj: re
        }, {
            agency: re
        }, {
            account: re
        }]
    };

    it('should call getAll with pagination params', async () => {

        const favCollection = new FavorecidosCollection();

        await favCollection.getAll(page, perPage);

        expect(mockedCollection.find).toBeCalledWith({});
        expect(mockedCollection.sort).toBeCalledWith({
            name: 1
        });
        expect(mockedCollection.skip).toBeCalledWith(0);
        expect(mockedCollection.limit).toBeCalledWith(10);
        expect(mockedCollection.toArray).toHaveBeenCalled();
    });

    it('should call getAll with pagination and search params', async () => {

        const favCollection = new FavorecidosCollection();

        await favCollection.getAll(2, 20, search);

        expect(mockedCollection.find).toBeCalledWith(filter);
        expect(mockedCollection.sort).toBeCalledWith({
            name: 1
        });
        expect(mockedCollection.skip).toBeCalledWith(20);
        expect(mockedCollection.limit).toBeCalledWith(20);
        expect(mockedCollection.toArray).toHaveBeenCalled();
    });

    it('should call getOne with an record id', async () => {

        const favCollection = new FavorecidosCollection();

        await favCollection.getOne(id);

        expect(mockedCollection.findOne).toBeCalledWith({
            _id: mongoObjectID
        });
    });

    it('should call insertOne instead of updateOne', async () => {

        const favCollection = new FavorecidosCollection();

        await favCollection.upsert(undefined, body);

        expect(mockedCollection.insertOne).toBeCalledWith(body);
        expect(mockedCollection.updateOne).not.toHaveBeenCalled();
    });

    it('should call updateOne instead of insertOne', async () => {

        mockedCollection.insertOne.mockClear();

        const favCollection = new FavorecidosCollection();
        const updateFilter = {
            _id: mongoObjectID
        };
        const updateValues = {
            $set: body
        };

        await favCollection.upsert(id, body);

        expect(mockedCollection.updateOne).toBeCalledWith(updateFilter, updateValues);
        expect(mockedCollection.insertOne).not.toHaveBeenCalled();
    });

    it ('should call deleteOne with an record id', async () => {

        const favCollection = new FavorecidosCollection();

        await favCollection.deleteOne(id);

        expect(mockedCollection.deleteOne).toBeCalledWith({
            _id: mongoObjectID
        });
    });

    it ('should call deleteMany with an array of records ids', async () => {

        const favCollection = new FavorecidosCollection();
        const ids = ['111111111111111111111111', '222222222222222222222222', '333333333333333333333333'];
        const filter = {
            _id: {
                $in: ids.map(id => new ObjectID(id))
            }
        };

        await favCollection.deleteMany(ids);

        expect(mockedCollection.deleteMany).toBeCalledWith(filter);
    });
});