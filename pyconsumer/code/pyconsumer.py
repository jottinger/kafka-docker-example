import pprint
from kafka import KafkaConsumer
import time
import json

print "hello, pyconsumer"
time.sleep(25) # delays for 5 seconds

print "PYCONSUMER IS ABOUT TO RUN ----------------------------"
# To consume latest messages and auto-commit offsets
consumer = KafkaConsumer('sample-topic',
                         group_id='pyconsumer',
                         bootstrap_servers=['kafkabroker:9092'],
                         value_deserializer=lambda m: json.loads(m.decode('ascii')))


for msg in consumer:
    print msg