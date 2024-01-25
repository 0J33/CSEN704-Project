import React, { useState, useEffect } from 'react';
import { ChatEngine } from 'react-chat-engine';
import axios from 'axios';

// TODO: fix chat
// TODO: add chat styling

function Chat() {
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [site, setSite] = useState('');

    if (localStorage.getItem('userType') === 'pharmacist') {
        setSite('pharmacy');
    } else if (localStorage.getItem('userType') === 'doctor') {
        setSite('clinic');
    } else if (localStorage.getItem('userType') === 'patient') {
        axios.get(process.env.REACT_APP_CLINIC_ENV + `/getPatientById/${localStorage.getItem('userId')}`)
            .then(response => {
                if (response.data) {
                    setSite('clinic');
                } else {
                    setSite('pharmacy');
                }
            })
    }

    useEffect(() => {
        // Fetch chat users on component mount
        const fetchData = async () => {
            await fetchChatUsers();
        };
        fetchData();
    }, []);

    const fetchChatUsers = () => {
        var users = [];
        if (site === 'clinic') {
            if (localStorage.getItem('userType') === 'doctor') {
                // get all pharmacists + get all patients with appointments with this doctor

                axios.get(process.env.REACT_APP_PHARMACY_ENV + '/pharmacists')
                    .then(response => {
                        users = response.data;
                    })
                    .catch(error => {
                        console.error('Error fetching pharmacists:', error);
                    });

                axios.get(process.env.REACT_APP_CLINIC_ENV + '/patients')
                    .then(response => {
                        for (var i = 0; i < response.data.length; i++) {
                            axios.get(process.env.REACT_APP_CLINIC_ENV + '/checkPatientDoctorChat', {
                                params: {
                                    patient_id: response.data[i]._id,
                                    doctor_id: localStorage.getItem('userId')
                                }
                            })
                                .then(response => {
                                    if (response.data) {
                                        users.push(response.data);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error fetching patients:', error);
                                });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching patients:', error);
                    });
            } else {
                // get all pharmacists + get all doctors with appointments with this patient

                axios.get(process.env.REACT_APP_PHARMACY_ENV + '/pharmacists')
                    .then(response => {
                        users = response.data;
                    })
                    .catch(error => {
                        console.error('Error fetching pharmacists:', error);
                    });

                axios.get(process.env.REACT_APP_CLINIC_ENV + '/doctors')
                    .then(response => {
                        for (var i = 0; i < response.data.length; i++) {
                            axios.get(process.env.REACT_APP_CLINIC_ENV + '/checkPatientDoctorChat', {
                                params: {
                                    patient_id: localStorage.getItem('userId'),
                                    doctor_id: response.data[i]._id
                                }
                            })
                                .then(response => {
                                    if (response.data) {
                                        users.push(response.data);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error fetching doctors:', error);
                                });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching doctors:', error);
                    });
            }
        } else {
            if (localStorage.getItem('userType') === 'pharmacist') {
                // get all doctors + get all patients

                axios.get(process.env.REACT_APP_CLINIC_ENV + '/doctors')
                    .then(response => {
                        users = response.data;
                    })
                    .catch(error => {
                        console.error('Error fetching doctors:', error);
                    });

                axios.get(process.env.REACT_APP_PHARMACY_ENV + '/patients')
                    .then(response => {
                        users = response.data;
                    })
                    .catch(error => {
                        console.error('Error fetching patients:', error);
                    });
            } else {
                // get all pharmacists

                axios.get(process.env.REACT_APP_PHARMACY_ENV + '/pharmacists')
                    .then(response => {
                        users = response.data;
                    })
                    .catch(error => {
                        console.error('Error fetching pharmacists:', error);
                    });
            }
        }
        setChatUsers(users);
    };

    const handleUserChange = (event) => {
        const newUser = event.target.value;
        setSelectedUser(newUser);
        // Fetch messages for the selected user
        fetchMessages(newUser);
    };

    const fetchMessages = (selectedUser) => {
        if (site === 'clinic') {
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
        if (site === 'clinic') {
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
                    <option key={user.REACT_APP_CLINIC_ENVid} value={user.username}>
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
