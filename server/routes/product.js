const express = require('express');
const { verificaToken } = require('../middlewares/autentication');

const app = express();
const Product = require('../models/product');

// Get All Products
app.get('/products', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Product.find({ available: true })
        .skip(desde)
        .limit(limite)
        .sort('name')
        .populate('category', 'name')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });
        });
});

// Get Product by Id
app.get('/products/:id', (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('category', 'name')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe.'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        });
});

// Buscar Productos
app.get('/products/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Product.find({ name: regex })
        .populate('category', 'name')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });
        });
});

// Create Products
app.post('/products', verificaToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });
    });
});

// Update Product
app.put('/products/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productDB.name = body.name;
        productDB.unitPrice = body.unitPrice;
        productDB.description = body.description;
        productDB.available = body.available;
        productDB.category = body.category;

        productDB.save((err, productoSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productoSaved
            });
        })

    });
});

// Delete Product
app.delete('/products/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productDB.available = false;
        productDB.save((err, productoSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productoSaved,
                message: 'Product not available.'
            });
        })

    });
});

module.exports = app;