'use strict'
const express = require('express')
const router = express.Router()
const path = require('path')
var __appName = path.dirname(__filename).split(path.sep).pop()

router.post('/', (req, res) => { // logout
    req.session.destroy(err => { // destroy session
        if(err) {
            return res.redirect('/')
        }
        res.clearCookie(process.env.COOKIENAME || 'cookie') // clear cookie
        res.redirect('/')
    })
})

module.exports = router