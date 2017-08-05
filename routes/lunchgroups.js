// var mongodb = require('mongodb');
// var index = require('./index');

// exports.formNewLunchGroups = function(req,res){
// 	console.log('inside routes/lunchgroups/formNewLunchGroups');
// 	// res.render('index');

// 	// Get the mongo client and connect to 'employees' db
// 	var MongoClient = mongodb.MongoClient;
// 	var url = 'mongodb://localhost:27017/employees';

// 	MongoClient.connect(url, function(err, db) {
// 		if (err) {
// 			console.log('Unable to connect to the server.', err);
// 		} else {
// 			var collection = db.collection('employeelist');
// 			collection.find({}).toArray(function(err, result) {
// 				if (err) {
// 					res.send(err);
// 				} else if (result[0].orderedlist.length) {
// 					//Get the current ordered list of employees
// 					var orderedList = result[0].orderedlist;

// 					//Shuffle the list
// 					var midPoint = Math.floor( orderedList.length / 2 );
// 					var firstHalf = orderedList.slice(0, midPoint);
// 					var secondHalf = orderedList.slice(midPoint, orderedList.length);
// 					secondHalf.reverse();
// 					var shuffledList = [];
// 					for (var i = 0; i < orderedList.length; i++) {
// 						var rand = Math.random();
// 						// console.log('rand: ' + rand);
// 						var item;
// 						if (rand < 0.5) {
// 							item = firstHalf.shift();
// 						} else {
// 							item = secondHalf.shift();
// 						}
// 						console.log(item);
// 						shuffledList.push(item);
// 					}

// 					//Calculate number of lunch groups
// 					var numGroups = Math.floor(shuffledList.length/4);

// 					var groupsArray = [];

// 					for (var i = 0; i < shuffledList.length; i++) {
// 						var groupIndex = i%numGroups;

// 						if (!groupsArray[groupIndex]) {
// 							groupsArray[groupIndex] = {'members': []};
// 						}

// 						groupsArray[groupIndex].members.push({'person': shuffledList[i]});
// 					}

// 					// lunchgroups: [ { members: [ {'person': <name>}, {'person': <name>}, ... ] },
// 					// 				  { members: [ {'person': <name>}, {'person': <name>}, ... ] },
// 					// 				  ... 
// 					//              ]
// 					res.render('index', {
// 						lunchgroups: groupsArray
// 					});

// 					console.log('end shuffling');
// 				} else {
// 					res.send('No employee list found.');
// 				}
// 			});
// 		}
// 		db.close();
// 	});
// }