import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Invalid from "./Invalid";

import AddWallet from "./components/AddWallet";
import Transactions from "./components/Transactions";
function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', width: "100%" }} >
          <Router>
            <Routes>
              <Route exact path='/' element={< AddWallet />}></Route>
              <Route exact path='/list-transactions' element={< Transactions />}></Route>
              <Route path='*' exact={true} element={<Invalid />} />
            </Routes>
          </Router>
        </Box>
      </Container>
    </>
  );
}

export default App;
