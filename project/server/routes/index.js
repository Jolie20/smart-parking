const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');
const vehicle = require('../controllers/vehicleController');
const lot = require('../controllers/parkingLotController');
const spot = require('../controllers/parkingSpotController');
const booking = require('../controllers/bookingController');
const session = require('../controllers/parkingSessionController');
const card = require('../controllers/cardDataController');

// Users
router.post('/users', user.createUser);
router.get('/users', user.getUsers);
router.get('/users/:id', user.getUserById);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);

// Vehicles
router.post('/vehicles', vehicle.createVehicle);
router.get('/vehicles', vehicle.getVehicles);
router.get('/vehicles/:id', vehicle.getVehicleById);
router.put('/vehicles/:id', vehicle.updateVehicle);
router.delete('/vehicles/:id', vehicle.deleteVehicle);

// Parking Lots
router.post('/lots', lot.createParkingLot);
router.get('/lots', lot.getParkingLots);
router.get('/lots/:id', lot.getParkingLotById);
router.put('/lots/:id', lot.updateParkingLot);
router.delete('/lots/:id', lot.deleteParkingLot);

// Parking Spots
router.post('/spots', spot.createParkingSpot);
router.get('/spots', spot.getParkingSpots);
router.get('/spots/:id', spot.getParkingSpotById);
router.put('/spots/:id', spot.updateParkingSpot);
router.delete('/spots/:id', spot.deleteParkingSpot);

// Bookings
router.post('/bookings', booking.createBooking);
router.get('/bookings', booking.getBookings);
router.get('/bookings/:id', booking.getBookingById);
router.put('/bookings/:id', booking.updateBooking);
router.delete('/bookings/:id', booking.deleteBooking);

// Sessions
router.post('/sessions', session.createSession);
router.get('/sessions', session.getSessions);
router.get('/sessions/:id', session.getSessionById);
router.put('/sessions/:id', session.updateSession);
router.delete('/sessions/:id', session.deleteSession);

// CardData
router.post('/cards', card.createCardData);
router.get('/cards', card.getCards);
router.get('/cards/:id', card.getCardById);
router.put('/cards/:id', card.updateCardData);
router.delete('/cards/:id', card.deleteCardData);

module.exports = router;


