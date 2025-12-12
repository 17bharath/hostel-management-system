const net = require('net');

const printerIP = '192.168.1.166';
const printerPort = 9100;
const testMessage = 'form submit successfully\n';

console.log(`Testing connection to printer at ${printerIP}:${printerPort}...`);

const client = new net.Socket();
let connected = false;

// Set timeout for connection
client.setTimeout(5000, () => {
    if (!connected) {
        client.destroy();
        console.error('Connection timeout - printer not responding');
        console.log('Possible reasons:');
        console.log('1. Printer is turned off or not connected to the network');
        console.log('2. IP address is incorrect');
        console.log('3. Port 9100 is not open on the printer');
        console.log('4. Firewall is blocking the connection');
        process.exit(1);
    }
});

client.connect(printerPort, printerIP, function () {
    connected = true;
    console.log('Connected to printer successfully');

    // Write the test message
    client.write(testMessage, function () {
        console.log('Test message sent to printer');
        client.end();
    });
});

client.on('close', function () {
    console.log('Connection closed');
    console.log('Test completed successfully - printer should be printing the test message');
    process.exit(0);
});

client.on('error', function (err) {
    console.error('Printer connection error:', err.message);
    console.log('Possible reasons:');
    console.log('1. Printer is turned off or not connected to the network');
    console.log('2. IP address is incorrect');
    console.log('3. Port 9100 is not open on the printer');
    console.log('4. Firewall is blocking the connection');
    process.exit(1);
});