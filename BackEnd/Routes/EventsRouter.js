const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const { authenticateToken, authorizeRole } = require('../Middleware/auth');
const EventController = require('../Controllers/EventController');

router.get('/', EventController.getAllEvents);
router.post('/', upload.single('photo'), authenticateToken, authorizeRole(['ADMIN', 'USER']), EventController.createEvent);
router.get('/user/:id', authenticateToken, authorizeRole(['USER']), EventController.getAllUserEvents);
router.get('/:id', EventController.getEventById);
router.put('/:id', upload.single('photo'), authenticateToken, authorizeRole(['ADMIN', 'USER']), EventController.updateEvent);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'USER']), EventController.deleteEvent);

module.exports = router;