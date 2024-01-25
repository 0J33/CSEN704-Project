import React, { useState, useEffect } from 'react';
import { ChatEngine } from 'react-chat-engine';
import axios from 'axios';

// TODO: add chat styling

function Chat() {
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Fetch chat users on component mount
        const fetchData = async () => {
            await fetchChatUsers();
        };
        fetchData();
    }, []);

    const fetchChatUsers = () => {
        var users = [];
        if (localStorage.getItem('userType') === 'patient' && localStorage.getItem('site') === 'clinic') {
            axios.get(process.env.REACT_APP_CLINIC_ENV + '/getDoctorsByAppointments/' + localStorage.getItem('userId'))
                .then(response => {
                    response.data.forEach(doctor => {
                        users.push(doctor);
                    });
                })
                .catch(error => {
                    console.error('Error fetching chat users:', error);
                });
        } else if (localStorage.getItem('userType') === 'patient' && localStorage.getItem('site') === 'pharmacy') {
            axios.get(process.env.REACT_APP_PHARMACY_ENV + '/pharmacists')
                .then(response => {
                    response.data.forEach(pharmacist => {
                        users.push(pharmacist);
                    });
                })
                .catch(error => {
                    console.error('Error fetching chat users:', error);
                });
        } else if (localStorage.getItem('userType') === 'doctor') {
            axios.get(process.env.REACT_APP_CLINIC_ENV + `/getPatientsByAppointments/${localStorage.getItem('userId')}`)                .then(response => {
                    response.data.forEach(patient => {
                        users.push(patient);
                    });
                })
                .catch(error => {
                    console.error('Error fetching chat users:', error);
                });
            axios.get(process.env.REACT_APP_PHARMACY_ENV + '/pharmacists')
                .then(response => {
                    response.data.forEach(pharmacist => {
                        users.push(pharmacist);
                    });
                })
                .catch(error => {
                    console.error('Error fetching chat users:', error);
                });
        } else if (localStorage.getItem('userType') === 'pharmacist') {
            axios.get(process.env.REACT_APP_CLINIC_ENV + '/patients')
                .then(response => {
                    response.data.forEach(patient => {
                        users.push(patient);
                    });
                })
                .catch(error => {
                    console.error('Error fetching chat users:', error);
                });
            axios.get(process.env.REACT_APP_PHARMACY_ENV + '/doctors')
                .then(response => {
                    response.data.forEach(doctor => {
                        users.push(doctor);
                    });
                })
                .catch(error => {
                    console.error('Error fetching chat users:', error);
                });
        }
        console.log(users);
        setChatUsers(users);
        console.log(chatUsers);
        if (chatUsers.length > 0) {
            console.log(users[0]._id);
        }
    };

    const handleUserChange = (event) => {
        const newUser = event.target.value;
        setSelectedUser(newUser);
        // Fetch messages for the selected user
        fetchMessages(newUser);
    };

    const fetchMessages = (selectedUser) => {
        if (localStorage.getItem('site') === 'clinic') {
            axios.post(process.env.REACT_APP_CLINIC_ENV + '/getMessages', {
                id: localStorage.getItem('userId'),
                receiver_id: selectedUser,
            })
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
        } else {
            axios.post(process.env.REACT_APP_PHARMACY_ENV + '/getMessages', {
                id: localStorage.getItem('userId'),
                receiver_id: selectedUser,
            })
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
        }
    };

    const handleSendMessage = () => {
        if (localStorage.getItem('site') === 'clinic') {
            axios.post(process.env.REACT_APP_CLINIC_ENV + '/sendMessage', {
                id: localStorage.getItem('userId'),
                receiver_id: selectedUser,
                message: newMessage,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            })
            .then(response => {
                // Message sent successfully, update the UI
                setMessages([...messages, { sender_id: localStorage.getItem('userId'), message: newMessage, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }]);
                setNewMessage('');
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
        } else {
            axios.post(process.env.REACT_APP_PHARMACY_ENV + '/sendMessage', {
                id: localStorage.getItem('userId'),
                receiver_id: selectedUser,
                message: newMessage,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            })
            .then(response => {
                // Message sent successfully, update the UI
                setMessages([...messages, { sender_id: localStorage.getItem('userId'), message: newMessage, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }]);
                setNewMessage('');
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <select className="form-control" onChange={handleUserChange} value={selectedUser}>
                <option value="">Select a user</option>
                {chatUsers.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.name}
                    </option>
                ))}
            </select>

            {selectedUser && (
                <div>
                    <div>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.sender_id}:</strong> {message.message}
                            </div>
                        ))}
                    </div>

                    <div>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
