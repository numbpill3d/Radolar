
const express = require('express');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const cors = require('cors');

// Initialize our shrine
const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const ALLOWED_ORIGIN = 'http://localhost:3000';

// Enable CORS like opening a portal between planes
app.use(cors({
    origin: ALLOWED_ORIGIN
}));

// Spawn our Python scanning daemon
const pythonScanner = spawn('python3', ['scanner.py']);
let scanResults = new Map();

// Handle messages from our Python familiar
pythonScanner.stdout.on('data', (data) => {
    try {
        const deviceInfo = JSON.parse(data);
        scanResults.set(deviceInfo.id, deviceInfo);
        
        // Broadcast to all connected scrying glasses
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(deviceInfo));
            }
        });
    } catch (e) {
        console.error('Failed to parse scanner output:', e);
    }
});

// WebSocket connection ritual
wss.on('connection', (ws) => {
    console.log('New scrying glass connected!');
    
    // Send current device list
    Array.from(scanResults.values()).forEach(device => {
        ws.send(JSON.stringify(device));
    });

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'scan_request') {
                // Trigger a new scanning ritual
                pythonScanner.stdin.write('scan\n');
            }
        } catch (e) {
            console.error('Failed to process message:', e);
        }
    });
});

// Create our Python scanner next
console.log(`
⚡️ Network Scanner Daemon v2.0 ⚡️
.: Watching for cliff racers in the digital winds :.
`);

app.listen(3000, () => {
    console.log('Shrine accessible at http://localhost:3000');
});
