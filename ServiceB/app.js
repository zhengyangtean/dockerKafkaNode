// Express importing and configuration
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 5000;
const app = express();
const serviceb = express.Router(); 

// Kafka importing and configuration
const kafka = require('kafka-node'),
	client = new kafka.KafkaClient({
			kafkaHost: 'kafka:9092',
			connectTimeout: 100000
		});
var Producer = kafka.Producer
var producer = new Producer(client);
var Consumer = kafka.Consumer
var consumer1 = new Consumer(client,[{ topic: 'Topic1'}]);

// on message recieve, process and publish it
consumer1.on('message', function (message) {
	console.log("consumer1 message: " + JSON.stringify(message))

	producer.send([{ topic: 'Topic2', messages: message["value"] + "_" + countText(message["value"])}], function (err, data) {
		if (err){
			// Handle Error
			console.log("producer2 send err : " + err);
        } else {
        	console.log("producer2 send data : " + JSON.stringify(data));
       	}
    });
});

app.use(cors());
app.use(bodyParser.json());

serviceb.route('/').get(function(req, res) {
    res.status(200).send("Hello World");
});

// Service logic
function countText(text) {
  return text.length;
}

// expose service function as a HTTP GET end point too
serviceb.route('/count/:msg').get(function(req, res) {
	var msg = req.params.msg;
    res.status(200).send(countText(msg).toString());
});

// configuring the route for serviceB
app.use('/serviceb', serviceb);

// start serviceA 's node app
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});