# Lunch Time
This web application was built to help a rapidly growing team more easily manage their lunch activities. It automatically generates groups of 3-5 people to divide up everyone into reasonably sized lunch groups. 

## Approach
### Technology stack
bootstrap, express-handlebars, vanilla js, jquery <=> express.js <=> mongodb
### Solving the problem
Inspiration was drawn from casino games, where in this case each card represents a person. As an initial solution, I implemented the [riffle shuffle](https://en.wikipedia.org/wiki/Shuffling#Riffle), the most common shuffling technique.

## How to bring up the app
This web app is not currently hosted on any public server. Here are the steps to bring it up locally:

Pre-requisites:
- [Git](https://help.github.com/articles/set-up-git/)
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/download-center)

In terminal, clone and set up the repository:
```
git clone https://github.com/leta415/lunch-groups-generator.git
cd lunch-groups-generator
mkdir data/
npm install
```
data/ is the directory where the database will be stored locally.

Let's set up the database:
```
mongod --dbpath data #opens the connection to the local db
```
You should see a message like 'waiting for connections on port 27017'. Keeping this terminal tab open, open a new tab and start up the MongoDB shell
```
mongo
```
Now in the shell, create a database called **employees** and insert an initial document:
```
> use employees
> db.employeelist.insert({id: 1, orderedlist: []}) #need to insert this exact document
```

In a new terminal tab, bring up the app:
```
npm start
```
If no errors, open a browser and go to url:
```
http://localhost:3000/
```

## How to run the unit tests
To run the tests, go to
```
http://localhost:3000/tests
```
Output is in console log.
