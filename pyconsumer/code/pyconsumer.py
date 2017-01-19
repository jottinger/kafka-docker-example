import pprint
from kafka import KafkaConsumer
import time
import json
import uuid

print "hello, pyconsumer"
time.sleep(25) # delays for 5 seconds

print "PYCONSUMER IS ABOUT TO RUN ----------------------------"
# To consume latest messages and auto-commit offsets
consumerGroupId='py'+str(uuid.uuid1())
print consumerGroupId
consumer = KafkaConsumer('sample-topic',
                         api_version=(0,9),
                         group_id='pyconsumer',
                         client_id=consumerGroupId,
                         bootstrap_servers=['kafkabroker:9092'],
                         value_deserializer=lambda m: json.loads(m.decode('ascii')))


for msg in consumer:
    print msg