const express = require('express');
const config = require('konphyg')(__dirname + '/../config')('mq-config');
const winston = require('winston');
const app = express();
const bodyParser = require('body-parser');
const Kafka = require('no-kafka');
const dns = require('dns');

var producer = new Kafka.Producer({
    clientId: config[config.connector].clientId,
    connectionString: config[config.connector].brokers
});

const sendMessage = function sendMessage(topic, message) {
    return producer.init().then(function () {
        return producer.send({
            topic: topic,
            message: {
                value: JSON.stringify(message)
            }
        });
    })
        .then(function (result) {
            // TODO what happens when a message is sent?
            winston.info('message sent to ' + topic + ' with result of ' + JSON.stringify(result));
        });
};

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello, producer');
});

app.listen(3000, function () {
    dns.lookup('kafkabroker', (err, addresses, family) => {
        winston.info('    kafka addresses:', JSON.stringify(addresses));
/*        const data={
            clientId: config[config.connector].clientId,
            connectionString: addresses+':9092'
        };
        winston.info(JSON.stringify(data,null,2));
        producer = new Kafka.Producer(data);
*/
    });
    dns.lookup('zookeeper', (err, addresses, family) => {
        winston.info('zookeeper addresses:', JSON.stringify(addresses));
    });
    winston.info('Example app listening on port 3000 in ' + config.mode + ' mode!');
    setTimeout(function () {
        sendMessage('sample-topic', 'test message');
    }, 10000);
});