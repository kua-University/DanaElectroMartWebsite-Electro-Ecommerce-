const db = require('../database/db');

const getProducts = (callback) => {
  db.all('SELECT * FROM products', [], callback);
};

const addProduct = (name, price, callback) => {
  db.run(
    'INSERT INTO products(name, price) VALUES(?, ?)',
    [name, price],
    callback
  );
};

module.exports = {
  getProducts,
  addProduct
};