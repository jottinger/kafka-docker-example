const express    = require ('express');
const config     = require ('konphyg') (__dirname + '/../config') ('mq-config');
const winston    = require ('winston');
const app        = express ();
const bodyParser = require ('body-parser');
const dns        = require ('dns');
const moment     = require ('moment');
//const KVStore = require('./kvstore');
const Queue      = require ('./queue');

winston.info (JSON.stringify (config.connector, null, 2));
winston.info (Queue.QueueTypes);
winston.info ('queuetypes:' + JSON.stringify (Queue.QueueTypes, null, 2));

let destination;

app.use (bodyParser.json ());

app.get ('/', function (req, res) {
  res.send ('Hello, producer');
  destination.publish (config[config.connector].input, 'test message from ' + moment ());
});

app.listen (3000, function () {
  dns.lookup ('kafkabroker', (err, addresses, family) => {
    winston.info ('    kafka addresses:', JSON.stringify (addresses));
  });
  dns.lookup ('zookeeper', (err, addresses, family) => {
    winston.info ('zookeeper addresses:', JSON.stringify (addresses));
  });
  winston.info ('Example app listening on port 3000 in ' + config.mode + ' mode!');
  setTimeout (function () {
    destination = new Queue.QueueTypes[config.connector] (config[config.connector]);
    destination.publish (config[config.connector].input, 'test message from ' + moment ());
  }, 7000);
});