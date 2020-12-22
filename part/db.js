'use strict'
const db = require('@zserver/database') // access database

module.exports = {
    dbFindOneUpdate: (collection, query, data) => { // insert data (save data)
        db.getDB().collection(collection).findOneAndUpdate(
            query // query object, what to find by, the ID of the data. _id get primary key (the object id in mongodb) of the data data
            , {$set : data} // pass in the document to update with. $set update operator. field1: value1. Update the value you want. data is the key field. value is the value of the key field. {field1: value1, fieldx: valuex}
            // , {returnOriginal : true} // false = return the modified object. boolean, default: true
            , {upsert : true} // true = create data if cant find
            , (err, result) => { // callback function: returns the result from searching the ID
            if(err)
                console.log(err) 
            }
        )
    } // await dbFindOneUpdate('product', {sku : fieldId}, {pageUrl: pageUrl})     
    , dbFindOneIfExistUpdate: (collection, query, data) => { // if data exist, update
        db.getDB().collection(collection).findOneAndUpdate(
            query
            , {$set : data}
            , {upsert : false} // false = dont add if cant find
            , (err, result) => {
            if(err)
                console.log(err) 
            }
        )
    } // await dbFindOneIfExistUpdate('product', {sku : fieldId}, {pageUrl: pageUrl})     
    , dbFindOneQuery: (collection, query) => { // find 1 data: query=search data; field
        const existData = db.getDB().collection(collection).findOne(query) // find first result only
        .then(existData => {
            return existData // return this data to existData as it's a promise
        }) 
        .catch(error => console.log(error))
        return existData
    } // const exist = await dbFindOneQuery('app', {appName: valueForm})
    , dbFindOneDelete: (collection, query) => { // find 1 data and delete
        const existData = db.getDB().collection(collection).findOneAndDelete(query) // find first result only
        .then(existData => {
            // const fieldData =  existData[field] // make variable = data of the field
            return existData // return this data to existData as it's a promise
        })
        .catch(error => console.log(error))
        return existData // return the data back to the function that called this function
    } // const existDbDataDelete = dbFindOneDelete('app', {_id : db.getPrimaryKey(formId)})    
    , dbFindAllArray: (collection, query) => { // find 1 data: query=search data; field
        const existData = db.getDB().collection(collection).find(query).toArray() // find first result only
        .then(existData => {
            // console.log(existData)
            // const fieldData =  existData[field] // make variable = data of the field
            return existData // return this data to existData as it's a promise
        })
        .catch(error => console.log(error))
        return existData // return the data back to the function that called this function
    } // eg const existRouteHome = await dbFindAllArray('app', '')
    // eg const existRouteHome = await dbFindAllArray('app', {field: value})
    , dbFindOneDelete: (collection, query) => { // find 1 data and delete
        const existData = db.getDB().collection(collection).findOneAndDelete(query) // find first result only
        .then(existData => {
            // const fieldData =  existData[field] // make variable = data of the field
            return existData // return this data to existData as it's a promise
        })
        .catch(error => console.log(error))
        return existData // return the data back to the function that called this function
    } // const existDbDataDelete = await dbFindOneDelete('app', {_id : db.getPrimaryKey(formId)})    
}