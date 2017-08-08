var express = require('express');
var Promise = require('bluebird');  
var mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
const util = require('util');

/* Home page */
exports.view = function(req, res) {

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
				} else if (result[0].orderedlist && result[0].orderedlist.length > 0) {
					//Get the current ordered list of employees
					var orderedList = result[0].orderedlist;
					var groupsArray = convertListToGroups(orderedList);

					orderedList.sort(); //for modify employee modal

					res.render('index', {
						lunchgroups: groupsArray,
						list: orderedList
					});
				} else {
					res.render('index', {
						lunchgroups: [],
						list: []
					});
				}
			});
		}
		db.close();
	});
}

/* Get current list from db and shuffle the current ordering. Then udpate the db with new ordered list. */
exports.formNewLunchGroups = function(req,res) {

	getShuffledLunchGroups()
		.then(function(shuffledList) {

			var url = 'mongodb://localhost:27017/employees';

			mongoClient.connectAsync(url)
				.then(function(db) {
					db.collection('employeelist').update({'id': 1}, { $set: {'orderedlist': shuffledList} });
					res.send(JSON.stringify({'newList': shuffledList, 'newGroups': convertListToGroups(shuffledList)}));
				})
				.catch(function(dberr) {
					console.log('Unable to update new lunch groups into the db.', dberr);
				});
		})
		.catch(function(err) {
			console.log('Unable to form new lunch groups.', err);
		});
};


exports.removePerson = function(req,res) {
	var url = 'mongodb://localhost:27017/employees';

	mongoClient.connectAsync(url)
		.then(function(db) {
			return db.collection('employeelist').findOneAndUpdate({'id': 1}, { $pull: {'orderedlist': req.params.name} });
		})
		.then(function(updatedDoc) {
			var updatedList = updatedDoc.value.orderedlist;
			var index = updatedList.indexOf(req.params.name);
			if (index > -1) {
    			updatedList.splice(index, 1);
			}	

			res.send(JSON.stringify({'newList': updatedList, 'newGroups': convertListToGroups(updatedList)}));
		})
		.catch(function(dberr) {
			console.log('Unable to update new lunch groups into the db.', dberr);
		});
}


exports.addPerson = function(req,res) {
	var url = 'mongodb://localhost:27017/employees';

	mongoClient.connectAsync(url)
		.then(function(db) {
			return db.collection('employeelist').findOneAndUpdate({'id': 1}, { $addToSet: {'orderedlist': req.params.name} });
		})
		.then(function(updatedDoc) {
			var updatedList = updatedDoc.value.orderedlist;
			updatedList.push(req.params.name);
			
			res.send(JSON.stringify( {'newList': updatedList, 'newGroups': convertListToGroups(updatedList)} ));
		})
		.catch(function(dberr) {
			console.log('Unable to update new lunch groups into the db.', dberr);
		});
}

/* HELPER FUNCTIONS BELOW */

var getCurrentLunchGroups = function() {
	var url = 'mongodb://localhost:27017/employees';

	return mongoClient.connectAsync(url)
		.then(function(db) {
			return db.collection('employeelist').findOne( {id: 1} );
		})
		.then(function(result) {
			return result;
		})
		.catch(function(err) {
			console.log('Unable to connect to the db.', err);
		});
};

var convertListToGroups = function(list) {

	var groupsArray = [];

	//Calculate number of lunch groups
	var numGroups = Math.ceil(list.length/4);

	if (list.length < 6) {
		numGroups = 1;
	}

	for (var i = 0; i < list.length; i++) {
		var groupIndex = i%numGroups;

		if (!groupsArray[groupIndex]) {
			groupsArray[groupIndex] = {'members': []};
		}

		groupsArray[groupIndex].members.push({'person': list[i]});
	}

	// lunchgroups: [ { members: [ {'person': <name>}, {'person': <name>}, ... ] },
	// 				  { members: [ {'person': <name>}, {'person': <name>}, ... ] },
	// 				  ... 
	//              ]
	return groupsArray;
}

var shuffleList = function(orderedList) {
	//['person2', 'person3', 'person1',...]

	//Shuffle the input list
	var midPoint = Math.floor( orderedList.length / 2 );
	var firstHalfStart = 0;
	var secondHalfStart = midPoint;
	
	for (var i = 0; i < orderedList.length; i++) {
		var rand = Math.random();
		if ( (rand < 0.5 || secondHalfStart >= orderedList.length) && firstHalfStart < midPoint) { 
			//we want to take from 1st half
			var temp = orderedList[firstHalfStart];
			orderedList[firstHalfStart] = orderedList[i];
			orderedList[i] = temp;
			firstHalfStart++;
		} else if (secondHalfStart < orderedList.length) {
			//we want to take from 2nd half
			var temp = orderedList[secondHalfStart];
			orderedList[secondHalfStart] = orderedList[i];
			orderedList[i] = temp;
			secondHalfStart++;
		}
	}

	return orderedList;
}

var getShuffledLunchGroups = function() {

	return getCurrentLunchGroups()
		.then(function(currentGroups) {

			if (currentGroups.orderedlist && currentGroups.orderedlist.length > 3) {
				return shuffleList(currentGroups.orderedlist);
			} else {
				return currentGroups.orderedlist;
			}	
		})
		.catch(function(err) {
			console.log('Unable to get the current lunch groups to shuffle.', err);
		});
};
