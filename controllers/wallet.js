const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const { isInt } = require("../helpers/validations");

const mongoose = require("mongoose");

const addWallet = async ({ name, balance }) => {
    const newWallet = new Wallet({
        _id: new mongoose.Types.ObjectId,
        name: name,
        balance: isInt(balance) ? balance : Number(balance.toFixed(4)) 
    });
    return newWallet.save()
}

const getWallet = async ({ walletId }) => {
    return Wallet.findById(walletId)
}

const updateWalletAmount = async ({ walletId, newBalance }) => {
    return Wallet.findByIdAndUpdate(walletId, { balance: newBalance })
}

const addTransaction = async ({ description, amount, type, walletId, isNew = false }) => {
    let isError = false;
    const errors = [];
    let data;
    let message;
    const currentWallet = await getWallet({ walletId });
    let parsedAmount = isInt(amount) ? Number(amount) : Number(amount.toFixed(4)) 
    let newBalance = isNew ? parsedAmount : currentWallet.balance + parsedAmount;
    newBalance = isInt(newBalance) ? Number(newBalance) : Number(newBalance.toFixed(4)) 
    if (currentWallet) {
        const newTransaction = new Transaction({
            _id: new mongoose.Types.ObjectId,
            description,
            amount: parsedAmount,
            type,
            walletId,
            balance: newBalance
        })
        try {
            data = await newTransaction.save();
        } catch (e) {
            console.log(e);
            throw Error("Transaction failed")
        }
        if (!isNew) {
            await updateWalletAmount({ walletId, newBalance });
        }
        message = "success";
        isError = false;
    } else {
        isError = true;
        message = "failed";
        console.log("No wallet found");
        errors.push("No wallet found");
    }
    return { isError, errors, message, data: { ...data._doc, newBalance } }
}

const gettransactionById = async ({ transactionId }) => {
    console.log(transactionId)
    return Transaction.findById(transactionId).populate("walletId", "name")
}

const getAllTransactions = async ({ walletId, skip, limit, order, sort }) => {
    const sortValue = order === "desc" ? -1 : 1 
    const allTransactions = await Transaction
        .find({ walletId })
        .skip(skip)
        .limit(limit)
        .sort({ [sort]: sortValue })

    const count = await Transaction
        .find({ walletId })
        .count()
    return { allTransactions, count };
}


module.exports = {
    addWallet,
    addTransaction,
    getAllTransactions,
    gettransactionById
}