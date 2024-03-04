import { useState } from "react";
import { Navbar } from "react-bootstrap";

function RegisterPatientClinic() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        date_of_birth: '',
        gender: 'male',
        mobile_number: '',
        emergencyContactName: '',
        emergencyContactMobile: '',
        emergencyContactRelation: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(credentials);
    
        // Making a POST request to the server
        fetch(process.env.REACT_APP_CLINIC_ENV + '/addPatient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle response data as needed (e.g., set user data, redirect, etc.)
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    return (
        <>
        <Navbar bg="light" variant="light" className="mb-4">
            <Navbar.Brand style={{ marginLeft: "15px" }}><img src="/icon.png" style={{ height: "20px", marginRight: "10px", marginBottom: "2px" }} />El7a2ny Pharmacy - Patient Register</Navbar.Brand>
        </Navbar>
        <div style={{width: '1000px', margin: 'auto', marginTop: '25px', marginBottom: '25px'}}>
            <form onSubmit={handleSubmit} className="p-4 border rounded">
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={credentials.username} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={credentials.password} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={credentials.name} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={credentials.email} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date of Birth:</label>
                    <input 
                        type="date" 
                        name="date_of_birth" 
                        value={credentials.date_of_birth} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Gender:</label>
                    <select 
                        name="gender" 
                        value={credentials.gender} 
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Mobile Number:</label>
                    <input 
                        type="tel" 
                        name="mobile_number" 
                        value={credentials.mobile_number} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Emergency Contact Name:</label>
                    <input 
                        type="text" 
                        name="emergencyContactName" 
                        value={credentials.emergencyContactName} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Emergency Contact Mobile:</label>
                    <input 
                        type="tel" 
                        name="emergencyContactMobile" 
                        value={credentials.emergencyContactMobile} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Emergency Contact Relation:</label>
                    <input 
                        type="text" 
                        name="emergencyContactRelation" 
                        value={credentials.emergencyContactRelation} 
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register as Patient</button>
            </form>
        </div>
        <br />
        </>
    );
}

export default RegisterPatientClinic;