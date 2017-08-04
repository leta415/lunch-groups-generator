var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* Home page */
router.get('/', function(req, res) {

	// Get the mongo client and connect to 'employees' db
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/employees';

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the server.', err);
		} else {
			var collection = db.collection('employeelist');
			collection.find({}).toArray(function(err, result) {
				if (err) {
					res.send(err);
				} else if (result[0].orderedlist.length) {
					//Get the current ordered list of employees
					var orderedList = result[0].orderedlist;
					var groups = [];

					//Calculate number of lunch groups
					var numGroups = Math.floor(orderedList.length/4);

					for (var i = 0; i < orderedList.length; i++) {
						var groupIndex = i%numGroups;

						if (!groups[groupIndex]) {
							groups[groupIndex] = {'members': []};
						}

						groups[groupIndex].members.push({'person': orderedList[i]});
					}

					// lunchgroups: [ { members: [ {'person': <name>}, {'person': <name>}, ... },
					// 				  { members: [ {'person': <name>}, {'person': <name>}, ... },
					// 				  ... 
					//              ]
					res.render('index', {
						lunchgroups: groups
					});
				} else {
					res.send('No employee list found.');
				}
			});
		}
		db.close();
	});
});

module.exports = router;
