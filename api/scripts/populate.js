const { MongoClient } = require('mongodb');
const configs = require('../src/common/configs');
const bulk = require('../assets/initial_bulk.json');
const ACCOUNT_TYPES = require('../assets/account_types.json');
const BANKS = require('../assets/banks.json');
const DIGITS = ['X', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function isBB(bank) {

    return bank === BANKS[0];
}

function getBank() {

    const random = Math.floor(Math.random() * BANKS.length);

    return BANKS[random];
}

function getAgencyDigit(bank) {

    const pattern = isBB(bank) ? /^[xX0-9]{0,1}$/ : /^[0-9]{0,1}$/;
    let digit = null;

    while(!digit && !pattern.test(digit)) {

        const random = Math.floor(Math.random() * DIGITS.length);

        digit = DIGITS[random];
    }

    return digit;
}

function getAgency(bank) {

    const is_bb = isBB(bank);
    const len = is_bb ? 9999 : 999999;

    return `${Math.floor(Math.random() * len) + 1}`;
}

function getAccountType(bank) {

    const types = isBB(bank) ? ACCOUNT_TYPES.bb : ACCOUNT_TYPES.other;
    const random = Math.floor(Math.random() * types.length);

    return types[random];
}

function getAccountDigit() {

    const pattern = /^[0-9]{0,1}$/;
    let digit = null;

    while(!digit && !pattern.test(digit)) {

        const random = Math.floor(Math.random() * DIGITS.length);

        digit = DIGITS[random];
    }

    return digit;
}

function getAccount(bank) {

    const is_bb = isBB(bank);
    const len = is_bb ? 999999 : 99999999;

    return `${Math.floor(Math.random() * len) + 1}`;
}

const favorecidos = bulk.map(({
    name,
    cpf_cnpj,
    email
}, i) => {

    const randomize = i % 3 != 0;
    const bank = getBank();

    return {
        name,
        cpf_cnpj,
        email,
        bank,
        agency: getAgency(bank),
        agency_digit: randomize ? getAgencyDigit(bank) : null,
        account: getAccount(bank),
        account_digit: getAccountDigit(),
        account_type: getAccountType(bank),
        status: randomize ? 'draft' : 'validated'
    };
});

MongoClient.connect(configs.mongodb.url, {
    useUnifiedTopology: true
}).then(connection => {

    const db = connection.db(process.env.MONGO_DB || 'transfeera');

    return db.collection('favorecidos').insertMany(favorecidos);
}).then(() => {

    console.log('Finished');

    process.exit();
}).catch(err => {

    console.error(err);

    process.exit();
});