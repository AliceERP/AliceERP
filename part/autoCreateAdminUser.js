'use strict'
module.exports = {
    autoCreateAdminUser: async (req) => {
        console.log('autoCreateAdminUser')
        const bcrypt = require('bcryptjs')
        const db = require('@zserver/database') // set this in package.json _moduleAliases
        const {dbFindOneUpdate} = require('@part/db')

        const password = process.env.ADMIN_PASSWORD
        const username = process.env.ADMIN_USERNAME
        const hashedPassword = await bcrypt.hash(password, 10) // saltRounds = 10
        await dbFindOneUpdate('user', {username : username}, {password: hashedPassword})  
    }

  
    }
    // autoCreateAdminUser: async (req) => {
    //     console.log('autoCreateAdminUser')
    //     const bcrypt = require('bcryptjs')
    //     const db = require('@zserver/database') // set this in package.json _moduleAliases
    //     const password = process.env.ADMIN_PASSWORD
    //     const username = process.env.ADMIN_USERNAME
    //     // const salt = await bcrypt.genSalt(10)
    //     // const hash = await bcrypt.hash(password, salt)
    //     bcrypt.genSalt(10, (err, salt) => {
    //         // console.log(`password ${password}`)
    //         bcrypt.hash(password, salt, (err, hash) => {
    //             if(err) throw err
    //             // password = hash // set clearPassword to hashPassword
    //             db.getDB().collection('user').findOneAndUpdate(
    //                 {username: username} // query object, what to find by, the ID of the data. _id get primary key (the object id in mongodb) of the data data
    //                 , {$set : {username: username, password: hash}} // pass in the document to update with. $set update operator. field1: value1. Update the value you want. data is the key field. value is the value of the key field. {field1: value1, fieldx: valuex}
    //                 // , {returnOriginal : true} // false = return the modified object. boolean, default: true
    //                 , {upsert : true} // false = return the modified object. boolean, default: true
    //                 , (err, result) => { // callback function: returns the result from searching the ID
    //                 if(err)
    //                     console.log(err) 
    //                 }
    //             )                
    //             db.getDB().collection('user').findOneAndUpdate(req.body, (err, result) => {
    //                 // dbFindOneUpdate('product', {sku : fieldId}, {pageUrl: pageUrl}) 
    //                 if (err) throw err
    //                 else {
    //                     req.flash('success_msg', 'Your account successfully created, thank you') // store msg in session and show it after redirect
    //                     console.log('admin user created')
    //                     res.redirect('/')
    //                 }
    //             })
    //         })
    //     })        
    // }
// }
