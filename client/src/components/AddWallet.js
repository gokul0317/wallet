import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import guseLocalstorage from "../hooks/useLocalstorage";
import axios from "axios";
import useAlert from "../hooks/useAlert"

export default function AddWallet() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const { getItem, isExist, setItem, wallet } = guseLocalstorage();
  const { alertMessage, setAlertMessage } = useAlert();
  const [nameError, setNameError] = useState("");
  const [descriptionError, setdescriptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [balanceError, setBalanceError] = useState("");

  const clearWallet = useCallback(() => {
    setName("");
    setBalance("");
  }, []);

  const clearTransaction = useCallback(() => {
    setDescription("");
    setAmount("");
  }, [])

  const validateWallet = useCallback(() => {
    let isError = false;
    if (!name.trim().length) {
      isError = true;
      setNameError("Name is required");
    }
    if (!balance.trim().length) {
      isError = true;
      setBalanceError("Balance is required");
    }

    if (balance.trim().length && Number(balance) < 0) {
      isError = true;
      setBalanceError("Balance should be greater than 0");
    }
    return isError;
  }, [name, balance])

  const validateTransaction = useCallback(() => {
    let isError = false;
    if (!description.trim().length) {
      isError = true;
      setdescriptionError("Description is required");
    }
    if (!amount.trim().length) {
      isError = true;
      setAmountError("amount is required");
    }

    if (amount.trim().length && Number(amount) === 0) {
      isError = true;
      setAmountError("Amount cannot be 0");
    }
    return isError;
  }, [description, amount])

  const createWallet = useCallback(async () => {
    const isWalletInvalid = validateWallet();
    if (isWalletInvalid) return;
    try {
      setLoading(true);
      const options = {
        url: `/setup`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        data: {
          name, balance: balance.trim().length ? Number(balance) : balance
        }
      };
      const resp = await axios(options);
      setItem(resp.data.data);
      setAlertMessage({ severity: "success", title: "Wallet created successsfully" });
      clearWallet();
    } catch (e) {
      console.log(e.response);
      setAlertMessage({ severity: "error", title: "Failed to create Wallet", message: e.response?.data?.errors.join(", ") })
    } finally {
      setLoading(false);
    }
  }, [name, balance, setItem, clearWallet, setAlertMessage, validateWallet]);

  const transaction = useCallback(async () => {
    const isTransactionInvalid = validateTransaction();
    if (isTransactionInvalid) return;
    const { id } = wallet
    if (id) {
      try {
        setLoading(true);
        const options = {
          url: `/transaction/${id}`,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          data: {
            description, amount: amount.trim().length ? Number(amount) : amount
          }
        };
        await axios(options);
        clearTransaction();
        setAlertMessage({ severity: "success", title: "Transaction successs" });
      } catch (e) {
        console.log(e.response);
        setAlertMessage({ severity: "error", title: "Transaction failed", message: e.response?.data?.errors.join(", ") });
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Skipping no wallet found")
    }
  }, [wallet, description, amount, clearTransaction, setAlertMessage, validateTransaction]);

  useEffect(() => {
    getItem();
  }, [getItem])

  const walletView = useMemo(() => {
    return (
      <>
        <Typography variant='h6' fontSize="14px">Add Wallet</Typography>
        <TextField size='small' label="User name" error={!!nameError.length} value={name} helperText={nameError} onChange={(e) => {
          const { value } = e.target
          if (value.trim().length) {
            setNameError("")
          }
          setName(value)
        }} />
        <TextField size='small' label="Balance" type="number" error={!!balanceError.length} value={balance} helperText={balanceError} onChange={(e) => {
          const { value } = e.target;
          if (value.trim().length) {
            setBalanceError("")
          }
          setBalance(value);
        }} />
        <LoadingButton loading={loading} size='small' variant='outlined' onClick={createWallet}>Submit</LoadingButton>
      </>
    )
  }, [name, balance, createWallet, loading, nameError, balanceError]);

  const transactoinView = useMemo(() => {
    return (<>
      <Typography variant='h6' fontSize="14px">Transaction</Typography>
      <TextField size='small' label="Description" value={description} error={!!descriptionError.length} helperText={descriptionError} onChange={(e) => {
        const { value } = e.target
        if (value.trim().length) {
          setdescriptionError("");
        }
        setDescription(value);
      }} />
      <TextField size='small' label="Amount" type="number" error={!!amountError.length} value={amount} helperText={amountError} onChange={(e) => {
        const { value } = e.target
        if (value.trim().length) {
          setAmountError("");
        }
        setAmount(value);
      }} />
      <LoadingButton loading={loading} size='small' variant='outlined' onClick={transaction}>Submit</LoadingButton>
      <Link className="MuiLink-button" to="/list-transactions">Transactions</Link>
    </>)
  }, [description, amount, transaction, loading, descriptionError, amountError])

  return (
    <Stack display="flex" direction="column" height="100%" justifyContent="center" alignItems="center">
      <Stack gap="1rem" justifyContent="center" alignItems="center" maxWidth="400px" >
        {!isExist ? walletView : transactoinView}
      </Stack>
      {alertMessage}
    </Stack>
  )
}
