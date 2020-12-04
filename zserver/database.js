'use strict'
const MongoClient = require('mongodb').MongoClient  // import mongodb driver, which is MongoClient
const ObjectID = require('mongodb').ObjectID    // the ObjectID from mongodb to use the ID field in mongodb
const dbname = process.env.DATABASE_NAME || 'testdb'
const url = 'mongodb://localhost:27017' // url of mongodb on local machine
const mongoOptions = {useUnifiedTopology: true, useNewUrlParser: true}    // option to pass in, use the new url parser

const state = { // db.js file make the connection between node js and mongodb server
    db: null    // default state is null meaning no database yet
}

const connect = cb => { // connect method cb for callback
    if(state.db) // if there's a database connection, call the callback
        cb()
    else {  
        MongoClient.connect(url, mongoOptions, (err, client) => { // if no connection, use mongodb to connect to the database
            if(err)
                cb(err) // if error, pass the error to the callback
            else {  
                state.db = client.db(dbname)    // if no error, set the state and call our callback
                cb()
            }
        })
    }
}

const getPrimaryKey = (_id) => { // to get the primary key ID field of mongodb, id of the document
    return ObjectID(_id) // return the object id object of mongodb, to query the database
}
const getId = (_id) => { // to get the primary key ID field of mongodb, id of the document
    return ObjectID(_id) // return the object id object of mongodb, to query the database
}

const getDB = () => { // to get the database
    return state.db
}

module.exports = {getDB, connect, getPrimaryKey, getId}    // export all the functions