import React, { useState, useEffect } from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function NotificationsPharm() {
    const [showModal, setShowModal] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        axios.get(process.env.REACT_APP_PHARMACY_ENV + '/getMedNotifications')
            .then(response => {
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Button className='mb-1 mt-1 ms-1 me-1' onClick={handleShowModal}>Notifications</Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length > 0 ? (
                        <ListGroup>
                            {notifications.map((notification, index) => (
                                <ListGroup.Item key={index}>
                                    {notification}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NotificationsPharm;
