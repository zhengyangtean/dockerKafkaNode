const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;

const app = express();
const servicea = express.Router(); 

const kafka = require('kafka-node'),
	client = new kafka.KafkaClient({
			kafkaHost: 'kafka:9092',
			connectTimeout: 100000
		});

var Producer = kafka.Producer
var producer = new Producer(client);
var Consumer = kafka.Consumer
var consumer2 = new Consumer(client,[{ topic: 'Topic2'}]);


// Creating topic, only need to be created once
var topicsToCreate = [{
	  topic: 'Topic1',
	  partitions: 1,
	  replicationFactor: 1
	}, {
	  topic: 'Topic2',
	  partitions: 1,
	  replicationFactor: 1
	}
  ];

client.createTopics(topicsToCreate, (error, result) => {
  // result is an array of any errors if a given topic could not be created
  	console.log("create send data : " + result);
    console.log("create send err : " + error);
});

consumer2.on('message', function (message) {
	splittedMessage = message["value"].split("_");
	console.log("consumer2 message : " + splittedMessage[0] + " length is " + splittedMessage[1]);
});

app.use(cors());
app.use(bodyParser.json());

servicea.route('/').get(function(req, res) {
    res.status(200).send("Hello World");
});

servicea.route('/publish/:msg').get(function(req, res) {
	var msg = req.params.msg;
	producer.send([{ topic: 'Topic1', messages: msg}], function (err, data) {
		if (err){
			// Handle Error
			console.log("producer1 send err : " + err);
		} else {
			console.log("producer1 send data : " + JSON.stringify(data));
			
		}
    });
    res.status(200).send(msg);
});

app.use('/servicea', servicea);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});