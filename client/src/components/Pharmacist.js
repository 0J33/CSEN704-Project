
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import {
    Routes,
    Route,
    Link,
    useRoutes,
    Router
} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import AdminAdmins from './AdminAdmins';
import AdminPharmacists from './AdminPharmacists';
import AdminPatients from './AdminPatients';
import AdminMedicines from './AdminMedicines';
import Medicines from './Medicines';
import Logout from './Logout';
import ChangePassword from './ChangePassword';
import SalesReport from './SalesReport'; 
import Chat from './Chat';
import WalletPharm from './WalletPharm';
import NotificationsPharm from './notificationsPharm';


function Pharmacist() {

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

  const pharmacistid = localStorage.getItem('userId'); // Replace with actual patient ID mechanism

    return (
      <Container fluid className="h-100 p-0">
        <Navbar bg="light" variant="light" className="mb-4">
          <Navbar.Brand style={{marginLeft:"15px"}}><img src="/icon.png" style={{height:"20px", marginRight:"10px", marginBottom:"2px"}} />El7a2ny Pharmacy - Pharmacist</Navbar.Brand>
        </Navbar>
        <Row className="h-100">
          <Col md={3} className={isMobile ? "bg-light" : "bg-light h-100"}>
            <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/admin/home">
              <Nav.Item>
                <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/pharmacist/medicines">Medicines</Nav.Link>
              </Nav.Item>
              <Nav.Item>
               <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/Pharmacist/sales">Sales</Nav.Link>
              </Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/Pharmacist/chat">Chat</Nav.Link>

              <br /><br />

              <WalletPharm></WalletPharm>
              <NotificationsPharm></NotificationsPharm>

              <ChangePassword></ChangePassword>
              <Logout> </Logout>
              {/* ... Other admin routes can go here */}

              { isMobile &&
                <><br /><br /><br /><br /></>
              }

            </Nav>
          </Col>
          
          <Col md={9} className="h-100">
            <Routes>
              <Route path="medicines" element={<Medicines role="pharmacist"/>} />
              <Route path="sales" element={<SalesReport />} />
              <Route path="chat" element={<Chat />} />

              {/* ... Other admin components can go here */}
              {/* <Route path="*" element={<h1>Pharmacist 404 Not Found</h1>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
  

export default Pharmacist;
