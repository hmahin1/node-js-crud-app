'use strict';
import models from '../../models';
import { hashPassword, generateToken, getPasswordResetCode } from '../services/middlewares/helper';
import { sendMail } from '../services/middlewares/mailer';
const { Validator } = require('node-input-validator');

export async function register(req, res) {
    try {
        let body = req.body;
        let { name, email, phone, password } = body;
        const v = new Validator(body, {
            email: 'required|email',
            password: 'required',
            phone: 'required',
            name: 'required'
        });
        const matched = await v.check();
        if (!matched) {
            return res.json({ code: v.status, success: false, error: v.errors, message: "Validation errors" });
        } else {
            let user = await models.user.findOne({ where: { email: email.toLowerCase() } });
            if (user) {
                return res.json({ code: 400, success: false, data: null, message: "Email already exist" });
            }
            else {
                let userObj = {
                    name: name,
                    email: email.toLowerCase(),
                    password: hashPassword(password),
                    phone: phone,
                    status: 'active'
                }
                let user = await models.user.create(userObj);

                res.json({ code: 200, success: true, data: user, message: 'register successfully ' });
            }
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, error: error, message: "Error while registering" });
    }
}
export async function login(req, res) {
    try {
        let body = req.body;
        let { email, password } = body;
        const v = new Validator(body, {
            email: 'required|email',
            password: 'required'
        });
        const matched = await v.check();
        if (!matched) {
            return res.json({ code: v.status, success: false, error: v.errors, message: "Validation errors" });
        } else {
            password = hashPassword(password);
            let user = await models.user.findOne({ where: { email: email.toLowerCase(), password: password }, attributes: ['id', 'email', 'name', 'status'] });
            if (user) {
                let obj = {
                    token: generateToken(),
                    user_id: user.id
                }
                let user_token = await models.user_token.create(obj);
                if (user_token) {
                    let user_object = {
                        user: user,
                        token: user_token.token
                    }
                    res.json({ code: 200, success: true, data: user_object, message: 'login successfully' });
                }
            }
            else {
                return res.json({ code: 400, success: false, data: null, message: "Email or password not found" });
            }
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, error: error, message: "Error while login" });
    }

}
export async function logout(req, res) {
        let token = req.headers['token'];
        let obj = { expire: true };
        try {
            let user_token = await models.user_token.update(obj, { where: { token: token } });
            if (user_token) {
                res.json({ code: 200, success: true, message: 'logout successfully' });
            }
        }
        catch (error) {
            return res.json({ code: 400, success: false, data: null, message: "Error while logout" });
        }
}

export async function resetPasswordEmail(req, res) {
    try {
        let body = req.body;
        let { email } = body;
        let resetPasswordCode;
        const v = new Validator(body, {
            email: 'required|email',
        });
        const matched = await v.check();
        if (!matched) {
            return res.json({ code: v.status, success: false, error: v.errors, message: "Validation errors" });
        } else {
            let user = await models.user.findOne({ where: { email: email.toLowerCase() } });
            if (user) {
                let resetPassword = await models.password_reset.findOne({ where: { user_id: user.id, status: 'active' } });
                if (resetPassword) {
                    resetPasswordCode = resetPassword.code;
                } else {
                    let obj = {
                        user_id: user.id,
                        code: await getPasswordResetCode(),
                        email: user.email,
                        status: 'active'
                    }
                    resetPassword = await models.password_reset.create(obj);
                    resetPasswordCode = resetPassword.code;
                }
                if (resetPasswordCode) {
                    let mailDetails = {
                        from: 'mailcrosser@gmail.com',
                        to: email,
                        subject: 'Password Reset',
                        text: 'This is your code for reset password ' + resetPasswordCode
                    };
                    sendMail(mailDetails)
                        .then(data => {
                            res.json({ code: 200, success: true, data: data, message: 'reset password email send success' });
                        }).catch(error => {
                            res.json({ code: 400, success: false, message: 'error while sending email code' });
                        });
                }
            }
            else {
                return res.json({ code: 400, success: false, data: null, message: "Email Not Found" });

            }
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, error: error, message: "Error while reset password" });
    }
}
export async function checkResetPasswordCode(req, res) {
    try {
        let body = req.body;
        let { email, code } = body;
        const v = new Validator(body, {
            email: 'required|email',
            code: 'required'
        });
        const matched = await v.check();
        if (!matched) {
            return res.json({ code: v.status, success: false, error: v.errors, message: "Validation errors" });
        } else {

            let user = await models.user.findOne({ where: { email: email.toLowerCase() } });

            await models.password_reset.findOne({ where: { user_id: user.id, code: code } }).then(async (reset) => {
                if (reset) {
                    if (reset.status == 'active') {
                        reset.status = 'complete';
                        reset.save();
                        res.json({ code: 200, success: true, message: 'code match success' });
                    } else {
                        return res.json({ code: 400, success: false, data: null, message: "Code Expired" });
                    }
                } else {
                    return res.json({ code: 400, success: false, data: null, message: "Invalid Code" });
                }

            }, err => {
                return res.json({ code: 400, success: false, data: null, message: err });
            })
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, error: error, message: "Error while reset password code api" });
    }
}

export const newPasswordChange = async (req, res) => {
    try {
        let body = req.body;
        let { new_pass, email } = body;
        const v = new Validator(body, {
            email: 'required|email',
            new_pass: 'required'
        });
        const matched = await v.check();
        if (!matched) {
            return res.json({ code: v.status, success: false, error: v.errors, message: "Validation errors" });
        } else {

            await models.user.findOne({
                where: {
                    email: email
                }
            }).then(async (user) => {
                if (user) {
                    user.password = hashPassword(new_pass);
                    user.save();
                    res.json({ code: 200, success: true, message: 'password changed successfully' });
                } else {
                    return res.json({ code: 400, success: false, message: 'user not found' });
                }

            }, err => {
                return res.json({ code: 400, success: false, data: null, message: err });
            })
        }
    }
    catch (error) {
        return res.json({ code: 400, success: false, error: error, message: "Error while save new password" });
    }
}