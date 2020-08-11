const { MongoClient } = require('mongodb');
const configs = require('../src/common/configs');
const bulk = require('../assets/initial_bulk.json');

const BANKS = ['001', '237', '104', '756'];
const DIGITS = ['X', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ACCOUNT_TYPES = {
    "bb": ['CONTA_CORRENTE', 'CONTA_POUPANCA', 'CONTA_FACIL'],
    "other": ['CONTA_CORRENTE', 'CONTA_POUPANCA']
};

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
    const agencyNumber = Math.floor(Math.random() * len) + 1;
    const generateDigit = agencyNumber % 2 === 0;
    const digit = generateDigit ? getAgencyDigit(bank) : null;

    return generateDigit ? `${agencyNumber}-${digit}` : `${agencyNumber}`;
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
    const accountNumber = Math.floor(Math.random() * len) + 1;
    const digit = getAccountDigit(bank);

    return `${accountNumber}-${digit}`;
}

const favorecidos = bulk.map(({
    name,
    cpf_cnpj,
    email
}, i) => {

    const bank = getBank();
    const agency = getAgency(bank);
    const account = getAccount(bank);
    const account_type = getAccountType(bank);

    return {
        name,
        cpf_cnpj,
        email,
        bank,
        agency,
        account,
        account_type,
        status: i % 2 === 0 ? 'draft' : 'validated'
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