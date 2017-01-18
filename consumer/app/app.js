const express    = require ('express');
const config     = require ('konphyg') (__dirname + '/../config') ('mq-config');
const winston    = require ('winston');
const app        = express ();
const bodyParser = require ('body-parser');
const Kafka      = require ('no-kafka');
const Promise    = require ('bluebird');
const consumer   = new Kafka.GroupConsumer ({
  clientId: config[config.connector].clientId,
  groupId: config[config.connector].groupId,
  connectionString: config[config.connector].brokers
});

const dataHandler = function (messageSet, topic, partition) {
  return Promise.each (messageSet,
    (m) => {
      winston.info (JSON.stringify ({
        topic: topic,
        partition: partition,
        offset: m.offset,
        message: m.message.value.toString ('utf8')
      }));
      // do something with the message here
      return consumer.commitOffset ({topic: topic, partition: partition, offset: m.offset, metadata: 'optional'});
    }
  );
};

let strategies=null;

app.use (bodyParser.json ());

app.get ('/', function (req, res) {
  res.send ('Hello, consumer');
});

app.listen (3000, function () {
  winston.info ('Example app listening on port 3000 in ' + config.mode + ' mode!');
  setTimeout (function () {

    winston.info ("setting up listener");
    strategies = [{
      subscriptions: [config[config.connector].input],
      handler: dataHandler
    }];
    consumer.init(strategies);
  }, 6000);
});