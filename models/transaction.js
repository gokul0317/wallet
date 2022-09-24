const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: {
        type: Date,
        default: Date.now
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    type: {
        type: "string",
        required: true
    },
    balance: {
        type: "number",
        required: true
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);