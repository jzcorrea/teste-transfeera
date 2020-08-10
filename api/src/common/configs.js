module.exports = {
    mongodb: {
        url: `mongodb://${process.env.MONGO_HOST || '127.0.0.1'}:${process.env.MONGO_PORT || 27017}`
    }
};