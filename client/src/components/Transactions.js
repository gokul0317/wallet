import React, { useEffect, useCallback, useState } from 'react'
import { Link } from "react-router-dom";
import useLocalstorage from "../hooks/useLocalstorage"
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import axios from "axios";

export default function Transactions() {
  const { wallet, getItem } = useLocalstorage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState("desc");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);

  const getTransactions = useCallback(async () => {
    const resp = await axios.get(`/transactions?walletId=${wallet.id}&skip=${skip}&limit=${limit}&order=${order}&sort=${sort}`);
    return resp.data;
  }, [wallet, limit, skip, sort, order])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSkip(newPage * limit)
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
    setSkip(0)
  };

  const handleSortChange = useCallback((event) => {
    setSort(event.target.value);
  }, []);

  
  const handleOrderChange = useCallback((event) => {
    setOrder(event.target.value);
  }, []);

  
  useEffect(() => {
    const cb = async () => {
      try {
        setLoading(true);
        const transactions = await getTransactions();
        setData(transactions.data);
        setCount(transactions.count);
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false);
      }
    }
    if (wallet?.id) {
      cb();
    }
  }, [getTransactions, limit, skip, wallet?.id, sort, order])
  

  useEffect(() => {
    if (!wallet) getItem()
  }, [wallet, getItem]);

  if (loading) {
    return (<Stack height="100%" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Stack>)
  }
  return (
    <Stack direction="column" gap="1rem" height="100%" minHeight="500px" justifyContent="center" alignItems="center" margin="1rem"  >
      <Stack direction="row" justifyContent="flex-start" alignItems="center" width="100%" gap="1rem" padding="1rem">
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} ><ChevronLeftIcon />Back</Link>
        <Typography variant='h6'>
          Transactions list
        </Typography>
      </Stack>
      <TableContainer component={Paper}  >
        <Table sx={{ minWidth: 650 }} aria-label="transaction table">
          <TableHead>
            <TableRow >
              <TableCell>Transaction Id</TableCell>
              <TableCell>Wallet Id</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map(({ _id, walletId, amount, balance, description, type, date }) => {
              return (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  key={_id}
                >
                  <TableCell component="th" scope="row">
                    {_id}
                  </TableCell>
                  <TableCell>{walletId}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{balance}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell>{new Date(date).toLocaleString()}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" gap="1rem" justifyContent="ceter" alignItems="center">
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              label="Sort"
              onChange={handleSortChange}
            >
              <MenuItem value="date">date</MenuItem>
              <MenuItem value="amount">amount</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order}
              label="Sort"
              onChange={handleOrderChange}
            >
              <MenuItem value="desc">desc</MenuItem>
              <MenuItem value="asc">asc</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Stack>
  )
}