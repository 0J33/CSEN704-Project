import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import { Button } from 'react-bootstrap';

function Wallet() {
  const [wallet, setWallet] = useState(0);
  const patientId = localStorage.getItem('userId'); // Replace with the appropriate method to get the patient's ID

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = () => {
    axios.get(process.env.REACT_APP_PHARMACY_ENV + `/checkWallet/${patientId}`)
      .then(response => {
        if (response.data === null) {
          setWallet(0);
          return;
        }
        setWallet(response.data);
      })
      .catch(error => {
        console.error('Error fetching wallet:', error);
      });
  };

  return (
    <Nav.Item>
      <Button variant="mb-1 mt-1 ms-1 me-1 btn btn-outline-secondary" style={{width: '-webkit-fill-available', textAlign: 'left'}}>Wallet Balance: ${wallet.toString()}</Button>
    </Nav.Item>
  );
}

export default Wallet;
