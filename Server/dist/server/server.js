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
        .from(['ruparee', 'marcus4guyen', 'Dollyns', 'jackmercy', 's'])
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

/*
mkdir websocket-node-express
cd websocket-node-express
npm init
// add the details of your project
npm i ws express --save
// install the necessary types (and typescript)...
npm i typescript @types/ws @types/express -D
// ...optionally install typescript globally (tnx _Maxxx_)
npm i -g typescript

// please compile my code
./node_modules/.bin/tsc    // or simply tsc (if installed globally)

// then run the server
node ./dist/server/server.js



*/