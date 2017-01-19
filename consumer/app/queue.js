const winston = require ('winston');
const NoKafka = require ('no-kafka');
const Promise = require ('bluebird');

class Queue {
  constructor(data) {
    this.config = data || {};
  }

  publish(topicName, message) {
    throw new Error (`Queue.publish('${topicName}', '${message}') called`);
  }

  poll(topics, cb) {
    throw new Error (`Queue.subscribe(${topics}, ${cb}) called directly`);
  }
}

class Kafka extends Queue {
  constructor(data) {
    super (data);
    this.producer = new NoKafka.Producer ({
      clientId: this.config.clientId,
      connectionString: this.config.brokers
    });
    this.consumer = new NoKafka.GroupConsumer ({
      clientId: this.config.clientId,
      groupId: this.config.groupId,
      connectionString: this.config.brokers
    });
  }

  publish(topicName, message, cb) {
    const p = this.producer;
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
      if (cb) {
        cb (result);
      }
    });
  }

  poll(topics, cb) {
    const p=this.consumer;
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
          if (cb) {
            cb (m);
          }
          return p.commitOffset ({
            topic: topic,
            partition: partition,
            offset: m.offset,
            metadata: 'optional'
          });
        }
      );
    };
    const strategies  = [{
      subscriptions: topics,
      handler: dataHandler
    }];
    this.consumer.init (strategies);
  }
}

const QueueTypes = {
  "Kafka": Kafka,
  "kafka": Kafka
};

module.exports = {
  Kafka,
  QueueTypes,
  Queue
};