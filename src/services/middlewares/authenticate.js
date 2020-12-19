'use strict';
import models from '../../../models';

export function authenticate(req,res,next) {
    let token = req.headers['token'] ? req.headers['token'] : null;
    if(token){
        models.user_token.findOne({ where: { token: token },include: [
            {
                model: models.user, as: 'user',
                required: false
            }
        ]}).then(data =>{
            if(data){
                if(data.expire){
                    return res.json({ code: 444, success: false, data: null, message: "Token expired" });    
                }else{
                    req['user'] = data.user;
                    return next();
                }
            }else{
                return res.json({ code: 444, success: false, data: null, message: "Invalid Token" });
            }

        })
        
    }
}