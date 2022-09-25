const objectID = require('mongoose').Types.ObjectId;

const validateSetup = (body) => {
    let isError = false;
    const errors = [];
    if (!body.name || !body.name.trim().length) {
        isError = true;
        errors.push("name is required");
    }

    if (isNaN(body.balance) || typeof body.balance === "string" ) {
        isError = true;
        errors.push("balance should be a number");
    }

    if (body.balance === undefined || body.balance === null) {
        isError = true;
        errors.push("balance is required");
    }

    if (Number(body.balance < 0)) {
        isError = true;
        errors.push("balance should be greater than 0");
    }
    return { isError, errors };
};

const validateTransaction = (body) => {
    let isError = false;
    const errors = [];
    if (!body.description || !body.description.trim().length) {
        isError = true;
        errors.push("description is required");
    }

    if (isNaN(body.amount) || typeof body.amount === "string") {
        isError = true;
        errors.push("amount should be a number");
    }

    if (body.amount === undefined || body.amount === null) {
        isError = true;
        errors.push("amount is required");
    }

    if (Number(body.amount === 0)) {
        isError = true;
        errors.push("amount cannot be 0");
    }
    
    return { isError, errors };
}

const validateTransactions = (query) => {
    let isError = false;
    const errors = [];
    let walletId = query.walletId;
    let skip = query.skip || 0;
    let limit = query.limit || 10;
    let sort = query.sort || "date";
    let order = query.order || "desc";
    if (!walletId) {
        isError = true;
        errors.push("walletId is required");
    }
    if (!objectID.isValid(walletId)) {
        isError = true;
        errors.push("walletId is invalid");
    }
    if (isNaN(skip)) {
        isError = true;
        errors.push("skip should be a number");
    }
    if (isNaN(limit)) {
        isError = true;
        errors.push("limit should be a number");
    }

    return { isError, errors, params: { walletId, skip, limit, sort, order } };
}

const isInt = (value) => {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

module.exports = {
    validateSetup,
    validateTransaction,
    validateTransactions,
    isInt
}