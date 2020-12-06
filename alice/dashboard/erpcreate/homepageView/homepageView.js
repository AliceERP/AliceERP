'use strict'
const express = require('express')
const router = express.Router()
const path = require('path')
const __appName = path.dirname(__filename).split(path.sep).pop()
module.exports = router
const db = require('@zserver/database') // access database

const bcrypt = require('bcryptjs')

const {aliceAsyncMiddleware} = require('@part/alice')
const {pAdminSuper} = require('@part/auth')
const {dbFindOneQuery, dbFindOneUpdate, dbFindAllArray, dbFindOneDelete} = require('@part/db')
const {div, divClass} = require('@part/erp')

router.post('/add', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    console.log('add')
    const {erpName, text, nameClass} = req.body
    console.log('add', erpName, text, nameClass)
    let rankFunction = {}
    let rankOutput = ''
    let rankNumber = ''
    if(erpName == 'div') {rankOutput = div(text)}
    if(erpName == 'divClass') {rankOutput = divClass(text, nameClass)}
    rankFunction = {rankNumber: rankNumber, erpName: erpName, text: text, nameClass: nameClass, pageName: 'site', pageEnd: 'front'}
    console.log('outsiderankOutput',rankOutput)
    console.log('outsid rankFunction',rankFunction)
    // save data
    // page name
    res.redirect('back')
}))

router.get('/', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {

    res.render(path.join(__dirname, `${__appName}`), {
        title: 'ERP Create | Alice ERP'
        , layout: 'aliceerp'
    })
}))

// Homepage View<br>
// Update View Page<br>
// New what?<br>
// Add text<br>
// Add class<br>
// Add link<br>
// Add form<br>
// Add button<br>
// Add template<br>
// Have Script Input Field<br>
// Have Parts<br>