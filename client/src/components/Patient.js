import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Form, Button, Modal } from 'react-bootstrap';
import {
  Routes,
  Route,
  Link,
  useRoutes,
  Router
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import AdminAdmins from './AdminAdmins';
import AdminPharmacists from './AdminPharmacists';
import AdminPatients from './AdminPatients';
import AdminMedicines from './AdminMedicines';
import Medicines from './Medicines';
import PatientPrescriptions from './PatientPrescriptions';
import Logout from './Logout';
import ChangePassword from './ChangePassword';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Chat from './Chat';
import WalletPharm from './WalletPharm';
import NotificationsPharm from './notificationsPharm';


function Patient() {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [showModalAddress, setShowModalAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [showModalOrders, setShowModalOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const patientId = localStorage.getItem('userId'); // Replace with actual patient ID mechanism

  const fetchOrders = () => {
    axios.get(process.env.REACT_APP_PHARMACY_ENV + `/getOrders/${patientId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  const cancelOrder = (orderId) => {
    axios.put(process.env.REACT_APP_PHARMACY_ENV + `/cancelOrder/${orderId}`)
      .then(() => {
        fetchOrders(); // Refresh the orders list
      })
      .catch(error => console.error('Error cancelling order:', error));
  };

  const renderOrderItem = (order) => (
    <div key={order._id}>
      <p>Order ID: {order._id}</p>
      <p>Address: {order.address}</p>
      <p>Date: {order.date}</p>
      <p>Status: {order.status}</p>
      <p>Amount: ${order.amount.toFixed(2)}</p>
      {/* Render each item in the order */}
      {order.items.map((item, idx) => (
        <div key={idx}>
          <span>{item.name} - {item.quantity} x ${item.price.toFixed(2)}</span>
        </div>
      ))}
      {order.status === 'pending' && (
        <Button onClick={() => cancelOrder(order._id)}>Cancel Order</Button>
      )}
    </div>
  );
  

  useEffect(() => {
    fetchAddresses(); 
  }, []); 

  


  const fetchAddresses = () => {
    axios.get(process.env.REACT_APP_PHARMACY_ENV + `/getAddresses/${patientId}`)
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => console.error('Error fetching addresses:', error));
  };

  const handleAddAddress = () => {
    axios.post(process.env.REACT_APP_PHARMACY_ENV + `/addAddress/${patientId}`, { address: newAddress })
      .then(() => {
        fetchAddresses(); // Fetch addresses again to update the list
        setNewAddress(''); // Reset new address input
        setShowModalAddress(false); // Close modal
      })
      .catch(error => console.error('Error adding address:', error));
  };

 




  return (
    <Container fluid className="h-100 p-0">
      <Navbar bg="light" variant="light" className="mb-4">
        <Navbar.Brand style={{ marginLeft: "15px" }}><img src="/icon.png" style={{ height: "20px", marginRight: "10px", marginBottom: "2px" }} />El7a2ny Pharmacy - Patient</Navbar.Brand>
      </Navbar>
      <Row className="h-100">
        <Col md={3} className={isMobile ? "bg-light" : "bg-light h-100"}>
          <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/admin/home">

            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/patient/medicines">Medicines</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/patient/PatientPrescriptions">Prescriptions</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/patient/chat">Chat</Nav.Link>
            </Nav.Item>
            <br />
            <Nav.Item>
              <Button className='mb-1 mt-1 ms-1 me-1' onClick={() => setShowModalAddress(true)}>Manage My Addresses</Button>
            </Nav.Item>
            <Nav.Item>
              <Button className='mb-1 mt-1 ms-1 me-1' onClick={() => { setShowModalOrders(true); fetchOrders(); }}>Orders</Button>
            </Nav.Item>
            <br />
            <WalletPharm></WalletPharm>
            <NotificationsPharm></NotificationsPharm>
            <ChangePassword></ChangePassword>
            <Logout> </Logout>

            { isMobile &&
              <><br /><br /><br /><br /></>
            }

            {/* ... Other admin routes can go here */}
          </Nav>
        </Col>

        <Col md={9} className="h-100">
          <Routes>
            <Route path="medicines" element={<Medicines role="patient" />} />
            <Route path="PatientPrescriptions" element={<PatientPrescriptions role="Patient" />} />
            <Route path="chat" element={<Chat/>}/>



            {/* ... Other admin components can go here */}
            {/* <Route path="*" element={<h1>Patient 404 Not Found</h1>} /> */}
          </Routes>
        </Col>
      </Row>

      {/* Address Management Modal */}

      <Modal show={showModalAddress} onHide={() => setShowModalAddress(false)}>

        <Modal.Header closeButton>
          <Modal.Title>Manage Addresses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {addresses.map((address, index) => (
              <li key={index}>{address.address}</li>
            ))}
          </ul>
          <Form onSubmit={(e) => { e.preventDefault(); handleAddAddress(); }}>
            <Form.Group>
              <Form.Label>New Address</Form.Label>
              <Form.Control
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter new address"
                required
              />
            </Form.Group>
            <br />
            <Button type="submit">Add Address</Button>
          </Form>
          <br />


        </Modal.Body>
      </Modal>

            {/* Orders Modal */}
            <Modal show={showModalOrders} onHide={() => setShowModalOrders(false)}>
        <Modal.Header closeButton>
          <Modal.Title>My Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
          {orders.map((order, index) => (
            <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '10px', padding: '10px' }}>
              {renderOrderItem(order)}
            </div>
          ))}
        </Modal.Body>
      </Modal>

    </Container>
  );
}


export default Patient;
