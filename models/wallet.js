const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Wallet', walletSchema);
