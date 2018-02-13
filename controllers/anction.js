const mongoose = require('mongoose');
const UserActions = require('../models/userAction');

exports.action_get_all = (req, res, next) => {
    UserActions.find({})
        .select('name action _id createdAt')
        .exec()
        .then(doc => {
            let response;
            if (doc) {
                response = {
                    count: doc.length,
                    UsersActions: doc
                }
            }

            return checkReposne(response, res);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.set_new_action = (req, res, next) => {
    const action = new UserActions({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        action: req.body.action
    });
    action.save()
        .then(
            result => {
                res.status(201).json({
                    massace: 'create new user action',
                    action
                })
            })
        .catch(err => {
            res.status(500).json({error: err});
        })
}

exports.get_action = (req, res, next) => {
    const id = req.params.id;
    UserActions.findById(id)
        .select('name action _id createdAt')
        .exec()
        .then(doc => {
            return checkReposne(doc, res);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.update_action = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    UserActions.update({_id: id}, {
        $set: updateOps
    })
        .exec()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({error: err}))
}

exports.delete_action = (req, res, next) => {
    const id = req.params.id;
    if (id) {
        UserActions.remove({_id: id})
            .exec()
            .then(result => res.status(200).json(result))
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    } else {
        UserActions.remove()
            .exec()
            .then(result => res.status(200).json(result))
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    }

}

checkReposne = (data, res) => {
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({massage: 'Entry not found'})
    }
}