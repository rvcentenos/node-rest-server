const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const User = require('../models/user');

const app = express();

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ state: true }, 'name email role state')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    users,
                    count: conteo
                });
            });

        })
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            user: userDB
        });
    });

});

// ==============================================
// Delete
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = {
        id,
        state: false
    }

    User.findByIdAndUpdate(id, body, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            user: userDeleted
        });
    });


    // User.findByIdAndRemove(id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (userDeleted == null) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     };

    //     res.json({
    //         ok: true,
    //         user: userDeleted
    //     });
    // });

});

module.exports = app;