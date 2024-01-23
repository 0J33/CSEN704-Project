//logout component that clear the localstorage token and type

import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function Logout() {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href='/';
    };
    return (
        <Button className='mb-1 mt-1 ms-1 me-1' variant="outline-danger" onClick={handleLogout}>Logout</Button>
    );
}

export default Logout;