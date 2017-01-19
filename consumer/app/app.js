const express    = require ('express');
const config     = require ('konphyg') (__dirname + '/../config') ('mq-config');
const winston    = require ('winston');
const app        = express ();
const bodyParser = require ('body-parser');
const Queue      = require ('./queue');

winston.info (JSON.stringify (config.connector, null, 2));
winston.info (Queue.QueueTypes);
winston.info ('queuetypes:' + JSON.stringify (Queue.QueueTypes, null, 2));

let destination;

app.use (bodyParser.json ());

app.get ('/', function (req, res) {
  res.send ('Hello, consumer');
});

app.listen (3000, function () {
  winston.info ('Example app listening on port 3000 in ' + config.mode + ' mode!');
  setTimeout (function () {
    winston.info ("setting up listener");
    destination = new Queue.QueueTypes[config.connector] (config[config.connector]);
    destination.poll ([config[config.connector].input],
      (m) => {
      });
  }, 6000);
});