const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../Middleware/auth');
const UserController = require('../Controllers/UserController');

router.get('/', authenticateToken, authorizeRole(['ADMIN']), UserController.getAllUsers);
router.get('/me', authenticateToken, UserController.getMyRole);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/register', UserController.createUser);
router.patch('/:id/block', authenticateToken, authorizeRole(['ADMIN']), UserController.handleblockUser);
router.get('/:id', authenticateToken, authorizeRole(['ADMIN']), UserController.getUserById);
router.patch('/:id/role', authenticateToken, authorizeRole(['ADMIN']), UserController.updateRole);
router.patch('/password/:id', authenticateToken, authorizeRole(['ADMIN', 'USER']), UserController.updatePassword);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), UserController.deleteUser);


module.exports = router;