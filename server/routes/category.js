const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');
const app = express();

const Category = require('../models/category');

// Listar todas las categorías
app.get('/category', verificaToken, (req, res) => {
    Category.find({})
        .sort('name')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });
        });
});

app.get('/category/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

app.post('/category', verificaToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

app.put('/category/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name']);

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

app.delete('/category/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe.'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria eliminada'
        });
    })
});

module.exports = app;