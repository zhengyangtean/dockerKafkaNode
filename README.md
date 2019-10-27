# dockerKafkaNode
To test the connectivity of 2 services via Kafka in Docker

## To use 
run "docker-compose up" 
run "docker ps" to verify that all 4 docker containers are up (zookeeper, kafka, serviceA, serviceB)
if any of the service crashed while launching run "CTRL + C" and run "docker-compose up" again
access the webpage on localhost:4000/servicea/publish/<test>, <test> will then be published into a kafka topic where serviceB is subscribing to.
ServiceB will consume the message and append the character count to the original string and republish back  into kafka where serviceA will's log will print the result

ServiceB is also accessible via localhost:5000/serviceb/count/<test>, which will return the number of character in <test>
