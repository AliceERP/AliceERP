'use strict'
const express = require('express')
const router = express.Router()
const path = require('path')
const __appName = path.dirname(__filename).split(path.sep).pop()
module.exports = router
const {db, getPrimaryKey} = require('@zserver/database') // access database

const bcrypt = require('bcryptjs')
const fs = require('fs-extra')

const {aliceAsyncMiddleware} = require('@part/alice')
const {pAdminSuper} = require('@part/auth')
const {dbFindOneQuery, dbFindOneUpdate, dbFindAllArray, dbFindOneDelete} = require('@part/db')
const {div, divClass} = require('@part/erp')
const {fsFileCreate} = require('@part/fs')
const {getFunctionName, getDataToArray, getArrayToOneData} = require('@part/get')
const {sortDataField} = require('@part/sort')

router.post('/add', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    console.log('add')
    const {erpName, text, nameClass, pageName, pageEnd, _id} = req.body
    let rankNumber = req.body.rankNumber
    let pageRank = +req.body.pageRank
    // console.log('add', rankNumber)
    let pageDetail = await dbFindAllArray('erpPage', {pageName: pageName, pageRank: pageRank})
    // console.log('pageDetail',pageDetail)
    let rankNumberMax = Math.max.apply(Math, pageDetail.map(function(o) { return o.rankNumber; }))
    console.log('rankNumberMax',rankNumberMax)
    if(_id) {
        console.log('rankNumber exist')
        // check if rankNumber equal existing
        const erpPageData = await dbFindOneQuery('erpPage', {_id: getPrimaryKey(_id)})
        let rankCurrent = erpPageData.rankNumber
        console.log('if ID rank',rankCurrent, rankNumber)

        // if yes
            // find max rankNumber
            // increase it by 1
            // loop backwards until rankNumber and increase that too

    } else {
        console.log('rankNumber NOT exist')
        if(rankNumberMax == '-Infinity') {rankNumberMax = 0}
        rankNumber = rankNumberMax + 1
    }
    console.log('rankNumber',rankNumber)
    let rankOutput = ''
    if(erpName == 'div') {rankOutput = div(text)}
    if(erpName == 'divClass') {rankOutput = divClass(text, nameClass)}
    let rankFunction = {}
    rankFunction = {pageRank, rankNumber: rankNumber, erpName: erpName, text: text, nameClass: nameClass, pageName: pageName, pageEnd: pageEnd, rankOutput}
    if(_id) {
        console.log('id exist')
        await dbFindOneUpdate('erpPage', {_id: getPrimaryKey(_id)}, rankFunction)  
    } else {
        console.log('id NOT exist')
        await dbFindOneUpdate('erpPage', {pageName, rankNumber}, rankFunction)  
    }
    // get all output and write to file
    // const pageWriteView = await dbFindAllArray('erpPage', {pageName: site, pageRank: 1})
    // console.log('pageWriteView',pageWriteView)
    const pageWriteView = await dbFindAllArray('erpPage', {pageName: 'site', pageRank: 1})
    // console.log('pageWriteView',pageWriteView)
    // const data = getDataToArray(pageWriteView, 'rankOutput')
    const data = getArrayToOneData(pageWriteView, 'rankOutput')
    console.log('data',data)
    fsFileCreate(path.join('site', `site.hbs`), data)
    res.redirect('back')
}))

router.get('/', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    // console.log('homepageview')
    const fileErp = await fs.readFile('./part/erp.js', 'utf8')
    // console.log('fileErp',fileErp)
    const functionName = getFunctionName(fileErp)
    // console.log('functionName',functionName)
    let pagePart = await dbFindAllArray('erpPage', {pageName: 'site', pageRank: 1})
    pagePart = pagePart.sort(sortDataField('rankNumber'))
    res.render(path.join(__dirname, `${__appName}`), {
        title: 'ERP Create | Alice ERP'
        , layout: 'aliceerp'
        , functionName
        , pagePart
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