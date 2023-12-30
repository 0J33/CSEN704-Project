import { useState } from "react";
import ForgetPassword from "./ForgetPassword";

function Login() {
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
        fetch('http://localhost:3000/login', {
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
            localStorage.setItem('type', data.userType);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userId', data.userId);

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
    

    return (
        <div>
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
            <button type="submit" className="btn btn-primary">Login</button>
            <button type="button" className="btn btn-secondary ms-5" onClick={() => window.location.href='/register-patient'}>Register As Patient</button>
            <button type="button" className="btn btn-secondary ms-5" onClick={() => window.location.href='/register-pharmacist'}>Register As Pharmacist</button>


        </form>

        <ForgetPassword></ForgetPassword>
        </div>

        
    );
}

export default Login;