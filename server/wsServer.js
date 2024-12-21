// wsServer.js - Our WebSocket enchantments
const WebSocket = require('ws');
const EventEmitter = require('events');

class WSServer extends EventEmitter {
    constructor(port = 8080) {
        super();
        this.wss = new WebSocket.Server({ port });
        this.clients = new Set();
        this.initializeServer();
    }

    initializeServer() {
        this.wss.on('connection', (ws) => {
            console.log('A new scrying glass connects to the digital void~');
            this.clients.add(ws);

            ws.on('message', (message) => {
                this.handleMessage(message, ws);
            });

            ws.on('close', () => {
                console.log('A scrying glass returns to the void~');
                this.clients.delete(ws);
            });
        });
    }

    broadcast(data) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

module.exports = WSServer;
