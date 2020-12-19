'use strict';

import {Router} from "express";
import {register,login,logout,resetPasswordEmail , checkResetPasswordCode , newPasswordChange} from '../controllers/auth';
import {authenticate} from "../services/middlewares/authenticate";
export default class Auth {
    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes() {
        let router = this.router;
        let auth = this.auth
        router.post('/register',register)
        router.post('/login', login)
        router.post('/logout', authenticate,logout)
        router.post('/reset-password-email', resetPasswordEmail)
        router.post('/reset-password-code', checkResetPasswordCode)
        router.post('/reset-password', newPasswordChange)
    }

    getRouter() {
        return this.router;
    }

    getRouteGroup() {
        return '/auth';
    }
}