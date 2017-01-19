const winston = require ('winston');
const NoKafka = require ('no-kafka');

class Queue {
  constructor(data) {
    this.config = data || {};
  }

  publish(topicName, message) {
    throw new Error (`Queue.publish('${topicName}', '${message}') called`);
  }
}

class Kafka extends Queue {
  constructor(data) {
    super (data);
    this.producer = new NoKafka.Producer ({
      clientId: this.config.clientId,
      connectionString: this.config.brokers
    });
  }

  publish(topicName, message) {
    const p=this.producer;
    return p.init ().then (function () {
      return p.send ({
        topic: topicName,
        message: {
          value: JSON.stringify (message)
        }
      });
    })
    .then (function (result) {
      // TODO what happens when a message is sent?
      winston.info ('message sent to ' + topicName + ' with result of ' + JSON.stringify (result));
    });
  }
}

const QueueTypes = {
  "Kafka":Kafka,
  "kafka":Kafka
};

module.exports = {
  Kafka,
  QueueTypes,
  Queue
};