const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../Middleware/auth');
const CategoriesController = require('../Controllers/CategoriesController');

router.get('/', CategoriesController.getAllCategories);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'USER']), CategoriesController.createCategory);
router.get('/:id', CategoriesController.getCategoryById);
router.put('/:id', authenticateToken, authorizeRole(['ADMIN']), CategoriesController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), CategoriesController.deleteCategory);

module.exports = router;