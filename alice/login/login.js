'use strict'
const express = require('express')
const router = express.Router()
const path = require('path')
const __appName = path.dirname(__filename).split(path.sep).pop()
module.exports = router
const db = require('@zserver/database') // access database

const {aliceAsyncMiddleware} = require('@part/alice')
const {dbFindOneQuery, dbFindOneDelete, dbFindOneUpdate} = require('@part/db')

const bcrypt = require('bcryptjs')
const Joi = require('joi') // access checks
const schemaPassword = Joi.object().keys({
    password: Joi.string().min(4).required()
})

router.post('/', aliceAsyncMiddleware(async(req, res) => {
    const {username, password} = req.body
    let errors = []
    if(!password) {
        errors.push({msg: 'Please enter your password'})
    }
    const {error, value} = schemaPassword.validate({password : password})
    // console.log('error', error)
    if(error) {
        console.log('error', error)
        // console.log('value', value)
        if(username === '') {
            errors.push({msg: 'Your must enter your Username'})
        } else {
            errors.push({msg: error.message})
        }
    }
    if(errors.length > 0) {
        res.render(path.join(__dirname, 'login'), {
            errors
        })
    } else {
        const usernameExist = await dbFindOneQuery('user', {username: username})
        if(usernameExist) { // if username exist
            const matchPassword = await bcrypt.compare(password, usernameExist.password)
            // console.log('matchPassword',matchPassword)
            if(matchPassword) { // true, theres a match, login, store user settings in cookie
                req.session.userId = usernameExist._id // storing id into cookie
                req.session.permission = usernameExist.permission // storing id into cookie
                dbFindOneDelete('session', {_id : usernameExist.session}) // delete old session
                dbFindOneUpdate('user', {_id : db.getPrimaryKey(usernameExist._id)}, {session: req.sessionID}) // save session ID in account session field
                req.flash('success_msg', 'Your login successful') // store msg in session and show it after redirect
                res.redirect('/')
            } else { // false

            }
        } else { // username not found, send generic error message
            errors.push({msg: 'Wrong username or password. Please enter your login details again.'})
            res.render(path.join(__dirname, 'login'), {
                errors
            })            
        }
    }
}))

router.get('/', aliceAsyncMiddleware(async(req, res) => {
    if(req.session.userId) { // if already logged in, redirect User back
        res.redirect('back')
    } else {
        res.render(path.join(__dirname, `${__appName}`), {
            // title: `${title} | ${site}`
        })
    }
}))