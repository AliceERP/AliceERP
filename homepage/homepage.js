'use strict'
const express = require('express')
const router = express.Router()
const path = require('path')
const __appName = path.dirname(__filename).split(path.sep).pop()
module.exports = router

const bodyParser = require('body-parser') // access forms to server
let urlencoded = bodyParser.urlencoded({extended: false})
router.use(bodyParser.json())
router.use(urlencoded)

const bcrypt = require('bcryptjs')

const {aliceAsyncMiddleware} = require('@part/alice')
const {dbFindOneUpdate} = require('@part/db')

router.get('/', aliceAsyncMiddleware(async(req, res) => {
    res.render(path.join(__dirname, `${__appName}`), {
        // title: `${title} | ${site}`
    })
}))

router.use('/alice/dashboard', require('../alice/dashboard/dashboard'))
router.use('/login', require('../alice/login/login'))
router.use('/logout', require('../alice/logout/logout'))

router.get('/init', aliceAsyncMiddleware(async(req, res) => {
    console.log('init')
    const password = process.env.ADMIN_PASSWORD
    const username = process.env.ADMIN_USERNAME
    const permission = process.env.ADMIN_PERMISSION
    const hashedPassword = await bcrypt.hash(password, 10) // saltRounds = 10
    await dbFindOneUpdate('user', {username: username}, {password: hashedPassword, permission: permission})  
    req.flash('success_msg', 'Your Admin account successfully created, thank you. Please click on login') // store msg in session and show it after redirect
    console.log('initFinish')
    res.redirect('/')
}))