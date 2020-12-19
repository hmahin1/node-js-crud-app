'use strict';

import express from 'express'
import Api from './api/index';

import config from './conf';
import cors from 'cors';
import { join } from 'path';
import bodyParser from 'express';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
let port = config.app['port'];
let whitelist = Object.keys(config.whitelist).map(k => config.whitelist[k]);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("port", port);
app.use(cors({
    origin: (origin, callback) => {
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1 || typeof origin === "undefined";
        callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
    }
}));

let users = [];
io.sockets.on('connection', (socket) => {
    // Set id
    socket.on('set user', (data, callback) => {
      if(users.indexOf(data) != -1){
        callback(false);
      } else {
        callback(true);
        socket.id = data;
        users.push(socket.id);
        updateUsers();
      }
    });
    socket.on('disconnect', function(data){
        if(!socket.id) return;
        users.splice(users.indexOf(socket.id), 1);
      });
});   

new Api(app).registerGroup();
app.io = io;
app.use('/static', express.static(join(__dirname, 'static')));



server.listen(port, () => {
    console.log(`server listening on ${port}`);
});
