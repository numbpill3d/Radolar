
from scapy.all import sniff, ARP
import json
import sys
import threading
import time

class NetworkScanner:
    def __init__(self):
        self.devices = {}
        self.running = True
    
    def start_scan(self):
        sniff(
            prn=self.process_packet,
            filter="arp",
            store=0,
            stop_filter=lambda _: not self.running
        )
    
    def process_packet(self, packet):
        if ARP in packet:
            device_info = {
                'id': packet[ARP].hwsrc,
                'name': self.get_vendor_name(packet[ARP].hwsrc),
                'type': 'Network Device',
                'ip': packet[ARP].psrc,
                'signalStrength': -(abs(packet.signal_strength) 
                    if hasattr(packet, 'signal_strength') else 50),
                'lastSeen': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            self.devices[device_info['id']] = device_info
            print(json.dumps(device_info), flush=True)
    
    def get_vendor_name(self, mac):
        # Simplified vendor lookup (expand with actual MAC vendor database)
        return f"Device_{mac.replace(':', '')[-6:]}"

if __name__ == '__main__':
    scanner = NetworkScanner()
    scanner_thread = threading.Thread(target=scanner.start_scan)
    scanner_thread.start()
    
    try:
        while True:
            cmd = sys.stdin.readline().strip()
            if cmd == 'scan':
                # Trigger an active scan
                pass
    except KeyboardInterrupt:
        scanner.running = False
        scanner_thread.join()
