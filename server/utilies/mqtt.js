const mqtt = require('mqtt');

// MQTT broker configuration
const MQTT_BROKER_URL = '91d4e16936c54687bcbae60a22ebf30c.s1.eu.hivemq.cloud'; // Replace with your broker URL
const MQTT_OPTIONS = {
    clientId: 'smart-parking-server-' + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    username: '', // Add if required
    password: '', // Add if required
};

// Topic to subscribe/publish
const TOPIC = 'smart-parking/updates';

// Create MQTT client
const client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

// Handle connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(TOPIC, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${TOPIC}`);
        } else {
            console.error('Subscription error:', err);
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
    // Add your message handling logic here
});

// Publish a message (example)
function publishMessage(payload) {
    client.publish(TOPIC, JSON.stringify(payload), (err) => {
        if (err) {
            console.error('Publish error:', err);
        } else {
            console.log('Message published:', payload);
        }
    });
}

module.exports = {
    client,
    publishMessage,
};