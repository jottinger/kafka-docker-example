# kafka-docker-example
An app that attempts to create a kafka broker, a consumer, and a producer

This application is meant to work out the configuration of kafka in a
docker-compose image.

To run, use the following two commands:

<pre>docker-compose build
docker-compose up</pre>

It will first build the images necessary to run the application (the `docker
build` step) and then execute the app with those images.

What I see on my machine is that the producer fails, not being able to find
the sample topic. This is an error. I don't know why it exists.