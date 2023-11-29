const Stock = require('../models/stock');
const path = require('path');


exports.getStocks = (req, res, next) => {
    Stock.findAll()
        .then((stocks) => {
            res.json(stocks);
        })
        .catch((error) => { res.send(error) })
}

exports.getAddStock = (req, res, next) => {
    const filePath = path.join(__dirname, '../index.html');
    res.sendFile(filePath);
}



exports.postAddStock = (req, res, next) => {
    const name = req.body.name; 
    const description = req.body.description;
    const price = req.body.price; 
    const quantity = req.body.quantity; 


    Stock.create({
        name: name,
        description: description,
        price: price,
        quantity: quantity
    })
    .then((result) => {
        res.json(result);
        console.log(result);
    })
    .catch((error) => {
        res.send(error);
        console.log(error);
    });
}

exports.getStockItem = (req, res, next) => {
    const prodId = req.params.id; // Assuming the stock ID is passed as a route parameter
    
    Stock.findByPk(prodId)
        .then(stock => {
            if (!stock) {
                return res.status(404).json({ error: 'Stock not found' });
            }
            res.json(stock);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

exports.updateItemStock = async (req, res, next) => {
    const prodId = req.params.id;
    const quantityChange = parseInt(req.body.quantityChange);

    console.log(quantityChange);

    if (isNaN(quantityChange)) {
        return res.status(400).json({ error: 'Invalid quantity change value' });
    }

    try {
        const stock = await Stock.findByPk(prodId);

        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        const currentQuantity = stock.quantity;
        const newQuantity = parseInt(currentQuantity) + parseInt(quantityChange);

        if (isNaN(newQuantity)) {
            throw new Error('Invalid quantity change');
        }

        if (newQuantity >= 0) {
            stock.quantity = newQuantity;
            await stock.save();

            console.log('Updated item quantity!');
            const responseStock = {
                id: stock.id,
                quantity: stock.quantity,
            };
            return res.json(responseStock);
        } else {
            throw new Error('Insufficient quantity');
        }
    } catch (err) {
        console.error(err);
        if (err.message === 'Invalid quantity change' || err.message === 'Insufficient quantity') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getEditStock = (req, res, next) => {
    const prodId = req.params.id;

    Stock.findByPk(prodId)
        .then(stock => {
            if (!stock) {
                return res.status(404).json({ error: 'Stock not found' });
            }
            res.json(stock);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

exports.editStock = (req, res, next) => {
    const prodId = req.params.id; 
    const updatedItemName = req.body.name;
    const updatedDescription = req.body.description; 
    const updatedPrice = req.body.price;
    const updatedQuantity = req.body.quantity;

    Stock.findByPk(prodId)
        .then(stock => {
            if (!stock) {
                return res.status(404).json({ error: 'Stock not found' });
            }
            stock.name = updatedItemName;
            stock.description = updatedDescription;
            stock.price = updatedPrice;
            stock.quantity = updatedQuantity;
            return stock.save();
        })
        .then(result => {
            console.log('UPDATED item!');
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};




exports.deleteStock = (req, res, next) => {
    const prodId = req.params.id;
    
    Stock.findByPk(prodId)
        .then(stock => {
            if (!stock) {
                return res.status(404).json({ error: 'Stock not found' });
            }
            return stock.destroy();
        })
        .then(result => {
            console.log('DESTROYED Stock');
            res.status(204).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};



