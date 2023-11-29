const express = require('express');

const router = express.Router();
const stockController = require('../controllers/stock');
const Stock = require('../models/stock');

router.get('/stocks', stockController.getStocks);

router.get('/:id', stockController.getStockItem);

router.put('/:id', stockController.updateItemStock);

router.get('/add-stock', stockController.getAddStock);

router.post('/add-stock', stockController.postAddStock);

router.delete('/delete-stock/:id', stockController.deleteStock);

router.get('/edit-stock/:id', stockController.getEditStock);

router.put('/edit-stock/:id', stockController.editStock);

module.exports = router;

