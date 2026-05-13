const express = require('express');
const router = express.Router();

const productModel = require('../models/productModel');
const redisClient = require('../cache/redisClient');

router.get('/', async (req, res) => {
  const cache = await redisClient.get('products');

  if (cache) {
    return res.json(JSON.parse(cache));
  }

  productModel.getProducts(async (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    await redisClient.set('products', JSON.stringify(rows));

    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { name, price } = req.body;

  productModel.addProduct(name, price, async (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    await redisClient.del('products');

    res.json({
      message: 'Product Added'
    });
  });
});

module.exports = router;
