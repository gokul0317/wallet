const express = require("express");
require('dotenv').config();
const mongoose = require('mongoose');
const { validateSetup, validateTransaction, validateTransactions } = require("./helpers/validations")
const { addWallet, addTransaction, getAllTransactions, gettransactionById } = require("./controllers/wallet");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Post req.body => name: string, balance: string;
app.post("/setup", async (req, res) => {
    const { isError, errors } = validateSetup(req.body);
    if (!isError) {
        try {
            const { name, balance } = req.body
            const savedWallet = await addWallet({ name, balance: Number(balance) });
            const { isError, data, errors, message } = await addTransaction({ description: "Setup", amount: Number(balance), type: "CREDIT", walletId: savedWallet._id, isNew: true })
            if (isError) {
                return res.status(400).send({ errors, message });
            } else {
                return res.status(200).send({ data: { id: savedWallet._id, balance: data.newBalance, name: savedWallet.name, transactionId: data._id, message, date: data.date }, message: "success" });
            }
        } catch (e) {
            console.log(e)
            return res.status(400).send({ errors: ["Failed to wave wallet"], data: req.body, message: "failed" });
        }
    } else {
        return res.status(400).send({ errors, message: "failed" });
    }
});

// Post req.body => description: string, amount: string; req.params => walletId : string;
app.post("/transaction/:walletId", async (req, res) => {
    const { walletId } = req.params;
    const { isError, errors } = validateTransaction(req.body);
    if (!isError) {
        try {
            const { description, amount } = req.body;
            const type = amount >= 0 ? "CREDIT" : "DEBIT";
            const { isError, data, errors, message } = await addTransaction({ description, amount: Number(amount), type, walletId });
            if (isError) {
                return res.status(400).send({ errors, message });
            } else {
                return res.status(200).send({ data: { balance: data.newBalance, transactionId: data._id, message }, message: "success" });
            }
        } catch (e) {
            console.log(e);
            return res.status(400).send({ errors: ["Failed to save transaction"], message: "failed" });
        }
    } else {
        return res.status(400).send({ errors, message: "failed" });
    }
});

// Get req.query => walletId: string, skip: number, limit: number;
app.get("/transactions", async (req, res) => {
    const { isError, errors, params } = validateTransactions(req.query);
    if (!isError) {
        try {
            const { allTransactions, count } = await getAllTransactions({ ...params })
            return res.status(200).send({ data: allTransactions, count, message: "success" });
        } catch (e) {
            console.log(e);
            return res.status(400).send({ errors: ["Failed to get transactions"], message: "failed" });
        }
    } else {
        return res.status(400).send({ errors, message: "failed" });
    }
})

app.get("/transaction/:transactionId", async (req, res) => {
    const { transactionId } = req.params
    try {
        const transaction = await gettransactionById({ transactionId });
        return res.status(200).json({ data: transaction, message: "success" })
    } catch (e) {
        console.log(e);
        return res.status(400).send({ errors: [`Failed to get transaction for ${tranasctionId}`], message: "failed" });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use((req, res) => {
    res.status(404).json({
        message: "No match found"
    })
});


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    });
})

