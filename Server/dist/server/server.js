"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Rx = require("rxjs");
const app = express();
// initialize a simplet http server
const server = http.createServer(app);
// initialzie the WebSocket server instance
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    // connection is up, let's add a simple event
    ws.on('message', (message) => {
        // log the received message and send it back to the client
        console.log('received: ', message);
        ws.send(`Hello, you sent -> ${message}`);
    });
    // send immediately a feedback to the incoming connection
    const producer = Rx.Observable
        .from(['marcus4guyen', 'Dollyns', 'jackmercy'])
        .concatMap(val => Rx.Observable.of(val).delay(5000))
        .repeat();
    producer.subscribe(val => {
        ws.send(val);
    });
});
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port}`);
});
// https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
// How to run
// .\node_modules\.bin\tsc
// node .\dist\server\server.js
//# sourceMappingURL=server.js.map