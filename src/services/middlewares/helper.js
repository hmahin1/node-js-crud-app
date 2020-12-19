'use strict';
import config from '../../conf';
import {createHash} from 'crypto'
const Crypto = require('crypto');
import models from '../../../models';

export function nodeENV() {
    return config.app['environment'] || "dev";
}

export function hashPassword(password) {
    let hash = createHash('RSA-SHA256').update(password).digest('hex');
    return hash;
}
export function generateToken() {
    return Crypto.randomBytes(40).toString('base64').slice(0, 40);
}
export async function getPasswordResetCode(){

    let randonNumber = Math.floor(Math.random() * (999999 - 1 + 1) + 1);
    let checkrandonNumberExist = await models.password_reset.findOne({ where: { code: randonNumber } });

    if(checkrandonNumberExist){
        getPasswordResetCode ();
    }
    return randonNumber;
}