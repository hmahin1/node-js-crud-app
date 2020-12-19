'use strict';

import models from '../../models';
const { Validator } = require('node-input-validator');

export async function getUser(req, res) {
    try {
        let user = await models.user.findById(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (user) {
            res.json({ code: 200, success: true, data: user, message: 'get user success' });
        } else {
            return res.json({ code: 400, success: false, data: null, message: "user not found" })
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, data: error, message: "Error while getting user" });
    }
}

export async function userItem(req, res) {
    try {
        let body = req.body;
        let { name, quantity, price } = body;
        const v = new Validator(body, {
            name: 'required',
            quantity: 'required',
            price: 'required',

        });
        const matched = await v.check();
        if (!matched) {
            return res.json({ code: v.status, success: false, error: v.errors, message: "Validation errors" });
        } else {

            let itemObj = {
                name: name,
                quantity: +quantity,
                price: price,
                status: 'active',
                user_id: req.user.id
            }
            if (req.params.id) {
                let item = await models.item_collaborative.findOne({ where: { id: req.params.id, user_id: req.user.id } });
                if (!item) {
                    return res.json({ code: 400, success: false, message: "Item not found" });
                }
                await models.item_collaborative.update(itemObj, { where: { id: req.params.id } });
                let updatedItem = await models.item_collaborative.findOne({ where: { id: req.params.id } });
                req.app.io.sockets.emit('notification', { msg: 'item updated successfully', data: updatedItem, user: req.user });

                res.json({ code: 200, success: true, data: updatedItem, message: 'item updated successfully ' });
            } else {
                let item = await models.item_collaborative.create(itemObj);
                req.app.io.sockets.emit('notification', { msg: 'create item successfully', data: item, user: req.user });

                res.json({ code: 200, success: true, data: item, message: 'item added successfully ' });
            }
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, data: error, message: "Error while updating or adding item" });
    }
}
export async function deleteUserItem(req, res) {
    try {
        if (req.params.id) {
            let item = await models.item_collaborative.findOne({ where: { id: req.params.id, user_id: req.user.id } });
            if (!item) {
                return res.json({ code: 400, success: false, message: "Item not found" });
            }
            let deleteItem = await models.item_collaborative.destroy({ where: { id: req.params.id } });
            req.app.io.sockets.emit('notification', { msg: 'item deleted successfully', data: item, user: req.user });
            res.json({ code: 200, success: true, message: 'item deleted successfully ' });
        } else {
            return res.json({ code: 400, success: false, message: "Item not found" });
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, data: error, message: "Error while deleting item" });
    }
}

export const getUserItems = async (req, res) => {
    try {
        let queryParams = req.query;
        await models.item_collaborative.findAndCountAll({
            where: { user_id: req.user.id },
            offset: parseInt(queryParams.min || 0),
            limit: parseInt(queryParams.max || 10),
            order: [
                ['updatedAt', 'DESC']
            ],
        }).then(items => {
            res.json({ code: 200, success: true, data: items, message: 'user item list' });
        }, err => {
            return res.json({ code: 400, success: false, error: err, message: "error while getting user items" });
        })
    }
    catch (error) {
        return res.json({ code: 400, success: false, error: error, message: "Error while getting user item" });
    }
}


export const getAllItems = async (req, res) => {
    try {
        let queryParams = req.query;
        await models.item_collaborative.findAndCountAll({
            offset: parseInt(queryParams.min || 0),
            limit: parseInt(queryParams.max || 10),
            order: [
                ['updatedAt', 'DESC']
            ],
        }).then(items => {
            res.json({ code: 200, success: true, data: items, message: 'item list' });
        }, err => {
            return res.json({ code: 400, success: false, error: err, message: "error while getting items" });
        })
    }
    catch (error) {
        return res.json({ code: 400, success: false, error: error, message: "Error while getting all items" });
    }
}