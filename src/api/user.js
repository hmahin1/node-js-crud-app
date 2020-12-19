'use strict';

import { Router } from "express";
import { getUser, userItem , deleteUserItem, getUserItems , getAllItems } from '../controllers/user';
import {authenticate} from "../services/middlewares/authenticate";

export default class User {
    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes() {
        let router = this.router;
        router.get('/user-by-id', authenticate, getUser) 
        router.post('/add-item/:id?', authenticate, userItem)
        router.delete('/del-item/:id', authenticate, deleteUserItem)
        router.get('/items',authenticate, getUserItems)
        router.get('/all-items', authenticate, getAllItems)
    }

    getRouter() {
        return this.router;
    }

    getRouteGroup() {
        return '/user';
    }
}