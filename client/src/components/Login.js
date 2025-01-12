import { useState, useEffect } from "react";
import ForgetPassword from "./ForgetPassword";
import ForgetPasswordClinic from "./ForgetPasswordClinic";
import { Navbar } from "react-bootstrap";

function Login() {

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

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
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
    
        // Making a POST request to the server
        fetch(process.env.REACT_APP_PHARMACY_ENV + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userType', data.userType);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('site', data.site);

            if(data.userType === 'patient')
                window.location.href='/patient';
            else if(data.userType === 'pharmacist')
                window.location.href='/pharmacist';
            else if(data.userType === 'admin')
                window.location.href='/admin';
            else
                window.location.href='/';
            // Handle response data as needed (e.g., set user data, redirect, etc.)
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    const loginClinic = () => {
        // Making a POST request to the server
        fetch(process.env.REACT_APP_CLINIC_ENV + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Store the token and user type in local storage or context/state management
            localStorage.setItem('token', data.token);
            localStorage.setItem('userType', data.userType);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('site', data.site);
    
            // Redirect based on user type
            if (data.userType === 'admin') {
                window.location.href = '/admin-clinic';
            } else if (data.userType === 'patient') {
                window.location.href = '/patient-clinic';
            } else if (data.userType === 'doctor') {
                window.location.href = '/doctor';
            }  else
            window.location.href='/';
        // Handle response data as needed (e.g., set user data, redirect, etc.)
        })
        .catch(error => {
            console.error('There was an error!', error);
            alert(error.message); // Display an error message to the user
        });
    }
    

    return (
        <>
        <Navbar bg="light" variant="light" className="mb-4">
            <Navbar.Brand style={{ marginLeft: "15px" }}><img src="/icon.png" style={{ height: "20px", marginRight: "10px", marginBottom: "2px" }} />El7a2ny - Login</Navbar.Brand>
        </Navbar>
        <div>
            <form onSubmit={handleSubmit} className="p-4 border rounded" 
                style={{
                    width: isMobile ? '90%' : 'fit-content', 
                    height: 'fit-content',
                    margin: 'auto',
                    marginTop: '25px'
                }}
            >
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
                <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <button type="submit" className="btn btn-primary">Login In Pharmacy</button> 
                    <button type="button" className="btn btn-primary ms-5" onClick={loginClinic} >Login In Clinic</button> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <button type="button" className="btn btn-secondary" onClick={() => window.location.href='/register-patient'}>Register As Pharmacy Patient</button> 
                    <button type="button" className="btn btn-secondary ms-5" onClick={() => window.location.href='/register-patient-clinic'}>Register As Clinic Patient</button> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <button type="button" className="btn btn-secondary" onClick={() => window.location.href='/register-pharmacist'}>Register As Pharmacist</button> 
                    <button type="button" className="btn btn-secondary ms-5" onClick={() => window.location.href='/register-doctor'}>Register As Doctor</button> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <ForgetPassword></ForgetPassword>
                    <ForgetPasswordClinic></ForgetPasswordClinic>
                    </div>
                </div>
            </form>
        </div>
        </>
    );
}

export default Login;