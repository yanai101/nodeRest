const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//const bcrypt = require('bcrypt');
const config = require("../..//appConfig");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const utils = require("../utils/passwordUtils");
const checkAuth = require('../../middleware/check-auth');

const util = new utils();

const User = require("../../models/users");

router.post("/singup", (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "user name exists"
                });
            } else {
                const encPass = util.encrypt(req.body.password.toString());
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.body.username,
                    password: encPass,
                    type: req.body.type
                });
                user
                    .save()
                    .then(data => res.status(201).json(data))
                    .catch(err => res.status(500).json({error: err}));
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post("/login", (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            const pass = req.body.password;
            if (user.length < 1) {
                return res.status(401).json({message: "Auth faild"});
            }
            if (util.encrypt(pass) == user[0].password) {
                const token = jwt.sign(
                    {
                        username: user[0].username,
                        userId: user[0]._id,
                        usertype: user[0].type
                    },
                    config.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: "Auth successful",
                    token
                });
            } else {
                return res.status(401).json({message: "Auth faild"});
            }
        })
        .catch(err => res.status(500).json({message: err}));
});


router.get("/:userId", (req, res, next) => {
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            let response;
            if (user) {
                user.password = util.decrypt(user.password);
                response = {
                    user
                }
            }
            return checkReposne(response, res);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});


router.put("/:userId", checkAuth, (req, res, next) => {
    const id = req.params.userId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    const encPass = util.encrypt(req.body.password.toString());

    User.update({_id: id}, {
        $set: {
            username: req.body.username,
            password: encPass,
            type: req.body.type
        }
    })
        .exec()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({error: err}))
});


router.get("/", checkAuth, (req, res, next) => {
    User.find({})
        .then(doc => {
            let response;
            if (doc) {
                response = {
                    count: doc.length,
                    users: doc
                };
            }
            return checkReposne(response, res);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.delete("/:userId", (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(response => {
            if (response.result.n) {
                res.status(200).json({message: "user deleted", response});
            } else {
                res.status(201).json({message: "user not found", response});
            }
        })
        .catch(err => res.status(500).json({message: err}));
});

checkReposne = (data, res) => {
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({massage: "Entry not found"});
    }
};

module.exports = router;
