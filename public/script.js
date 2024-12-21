// script.js - Our sacred detection algorithms
class NetworkScanner {
    constructor() {
        this.devices = new Map();
        this.whitelist = new Set();
        this.blacklist = new Set();
        this.ws = new WebSocket('ws://localhost:8080');
        this.initializeWebSocket();
    }

    initializeWebSocket() {
        this.ws.onmessage = (event) => {
            const deviceInfo = JSON.parse(event.data);
            this.processDevice(deviceInfo);
        };
    }

    async scanForDevices() {
        try {
            // Attempt Bluetooth scanning ritual
            if ('bluetooth' in navigator) {
                const bluetoothDevice = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: ['generic_access']
                });
                this.processDevice({
                    id: bluetoothDevice.id,
                    name: bluetoothDevice.name || 'Unknown Device',
                    type: 'Bluetooth',
                    signalStrength: -50,
                    lastSeen: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Scanning ritual failed:', error);
        }
    }

    processDevice(device) {
        device.status = this.classifyDevice(device);
        device.position = this.calculatePosition(device.signalStrength);
        
        this.devices.set(device.id, device);
        this.updateUI();
    }

    classifyDevice(device) {
        if (this.whitelist.has(device.id)) return 'friendly';
        if (this.blacklist.has(device.id)) return 'hostile';
        return 'unknown';
    }

    calculatePosition(signalStrength) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.abs(signalStrength) / 100;
        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance
        };
    }

    updateUI() {
        const radar = document.getElementById('radar');
        const deviceList = document.getElementById('device-list');
        
        // Clear previous scrying results
        radar.innerHTML = '';
        deviceList.innerHTML = '';

        // Update our cyber-eye display
        this.devices.forEach(device => {
            this.createRadarBlip(device, radar);
            this.createDeviceCard(device, deviceList);
        });

        // Update stats
        document.getElementById('deviceCount').textContent = this.devices.size;
        document.getElementById('scanCount').textContent = 
            Array.from(this.devices.values())
                .filter(d => d.type === 'Bluetooth').length;
    }

    createRadarBlip(device, radar) {
        const blip = document.createElement('div');
        blip.className = `blip ${device.status}`;
        
        const pos = device.position;
        const centerX = radar.offsetWidth / 2;
        const centerY = radar.offsetHeight / 2;
        
        blip.style.left = `${centerX + (pos.x * centerX)}px`;
        blip.style.top = `${centerY + (pos.y * centerY)}px`;
        
        radar.appendChild(blip);
    }

    createDeviceCard(device, container) {
        const card = document.createElement('div');
        card.className = `device ${device.status}`;
        card.innerHTML = `
            <h3>${device.name}</h3>
            <p>Type: ${device.type}</p>
            <p>Signal: ${device.signalStrength}dBm</p>
            <p>Status: ${device.status}</p>
        `;
        container.appendChild(card);
    }
}

// Initialize our cyber-scrying glass
const scanner = new NetworkScanner();
document.getElementById('scanButton').addEventListener('click', () => {
    scanner.scanForDevices();
});

// Handle whitelist/blacklist toggles
document.getElementById('toggleWhitelist').addEventListener('click', () => {
    const deviceList = document.getElementById('device-list');
    deviceList.classList.toggle('show-friendly');
});

document.getElementById('toggleBlacklist').addEventListener('click', () => {
    const deviceList = document.getElementById('device-list');
    deviceList.classList.toggle('show-hostile');
});
