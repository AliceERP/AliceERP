'use strict'
const express = require('express')
const router = express.Router()
const path = require('path')
const __appName = path.dirname(__filename).split(path.sep).pop()
module.exports = router
const db = require('@zserver/database') // access database

const {aliceAsyncMiddleware} = require('@part/alice')
const {pAdminSuper} = require('@part/auth')

router.get('/', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    res.render(path.join(__dirname, `${__appName}`), {
        title: 'Settings | Alice ERP'
        , layout: 'aliceerp'
    })
}))