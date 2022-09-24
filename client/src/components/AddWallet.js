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

  const clearWallet = useCallback(() => {
    setName("");
    setBalance("");
  }, []);

  const clearTransaction = useCallback(() => {
    setDescription("");
    setAmount("");
  }, [])

  const createWallet = useCallback(async () => {
    try {
      setLoading(true);
      const options = {
        url: `/setup`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        data: {
          name, balance: balance
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
  }, [name, balance, setItem, clearWallet, setAlertMessage]);

  const transaction = useCallback(async () => {
    setLoading(true);
    const { id } = wallet
    if (id) {
      try {
        const options = {
          url: `/transaction/${id}`,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          data: {
            description, amount
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
    }
  }, [wallet, description, amount, clearTransaction, setAlertMessage]);

  useEffect(() => {
    getItem();
  }, [getItem])

  const walletView = useMemo(() => {
    return (
      <>
        <Typography variant='h6' fontSize="14px">Add Wallet</Typography>
        <TextField size='small' label="User name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField size='small' label="Balance" value={balance} onChange={(e) => {
          const { value } = e.target
          setBalance(value)
        }} />
        <LoadingButton loading={loading} size='small' variant='outlined' onClick={createWallet}>Submit</LoadingButton>
      </>
    )
  }, [name, balance, createWallet, loading]);

  const transactoinView = useMemo(() => {
    return (<>
      <Typography variant='h6' fontSize="14px">Transaction</Typography>
      <TextField size='small' label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField size='small' label="Amount" value={amount} onChange={(e) => {
        const { value } = e.target
        setAmount(value)
      }} />
      <LoadingButton loading={loading} size='small' variant='outlined' onClick={transaction}>Submit</LoadingButton>
      <Link className="MuiLink-button" to="/list-transactions">Transactions</Link>
    </>)
  }, [description, amount, transaction, loading])

  return (
    <Stack display="flex" direction="column" height="100%" justifyContent="center" alignItems="center">
      <Stack gap="1rem" justifyContent="center" alignItems="center" maxWidth="400px" >
        {!isExist ? walletView : transactoinView}
      </Stack>
      {alertMessage}
    </Stack>
  )
}
