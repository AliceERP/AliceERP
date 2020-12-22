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
const {dbFindOneQuery, dbFindOneUpdate, dbFindAllArray, dbFindOneDelete, dbFindOneIfExistUpdate} = require('@part/db')
const {div, divClass} = require('@part/erp')
const {fsFileCreate} = require('@part/fs')
const {getFunctionName, getDataToArray, getArrayToOneData} = require('@part/get')
const {sortDataField} = require('@part/sort')

router.post('/add', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    console.log('add')
    const {erpName, text, nameClass, pageName, pageEnd, _id} = req.body
    const rankNumberNew = +req.body.rankNumber
    console.log('rankNumberNew',rankNumberNew)
    const pageRank = +req.body.pageRank
    // console.log('add', rankNumber)
    let pageDetail = await dbFindAllArray('erpPage', {pageName: pageName, pageRank: pageRank})
    // console.log('pageDetail',pageDetail)
    const rankNumberMax = Math.max.apply(Math, pageDetail.map(function(o) { return o.rankNumber; }))
    // console.log('rankNumberMax',rankNumberMax)
    if(_id) { // dealing with rankNumber
        console.log('rankNumber exist')
        // check if rankNumber equal existing
        const erpPageData = await dbFindOneQuery('erpPage', {_id: getPrimaryKey(_id)})
        const rankNumberOld = erpPageData.rankNumber
        console.log('rankNumberOld',rankNumberOld)
        let intervalStep = 0
        if(rankNumberOld == rankNumberNew) {
            console.log('noChange')
            // direction = 'noChange'
            // intervalStep = 0
        } else if(rankNumberNew > rankNumberOld) { // going downwards
            console.log('downwards', rankNumberNew, rankNumberOld)
            // direction = 'downard'
            intervalStep = rankNumberNew - rankNumberOld
            console.log('intervalStep',intervalStep)
            for(let i = 0; i < intervalStep; i++) {
                console.log('downards', [i])
                let rankSearch = rankNumberOld + 1 + i
                let rankUpdate = rankNumberOld + i
                await dbFindOneIfExistUpdate('erpPage', {pageName, pageRank, 'rankNumber': rankSearch}, {'rankNumber': rankUpdate})
            }
        } else { // going upwards
            console.log('upward', rankNumberNew, rankNumberOld)
            // direction = 'upward'
            intervalStep = rankNumberOld - rankNumberNew
            console.log('intervalStep',intervalStep)
            for(let i = 0; i < intervalStep; i++) {
                console.log('upwards', [i])
                let rankSearch = rankNumberNew - 1 - i
                let rankUpdate = rankNumberNew - i
                await dbFindOneIfExistUpdate('erpPage', {pageName, pageRank, 'rankNumber': rankSearch}, {'rankNumber': rankUpdate})
            }
        }
    }
    // console.log('rankNumber',rankNumber)
    let rankOutput = ''
    if(erpName == 'div') {rankOutput = div(text)}
    if(erpName == 'divClass') {rankOutput = divClass(text, nameClass)}
    let rankFunction = {}
    rankFunction = {pageRank, rankNumber: rankNumberNew, erpName: erpName, text: text, nameClass: nameClass, pageName: pageName, pageEnd: pageEnd, rankOutput}
    if(_id) { // if new part, use id
        // console.log('id exist')
        await dbFindOneUpdate('erpPage', {_id: getPrimaryKey(_id)}, rankFunction)  
    } else {
        // console.log('id NOT exist')
        await dbFindOneUpdate('erpPage', {pageName, rankNumber: rankNumberNew}, rankFunction)  
    }
    // get all output and write to file
    // const pageWriteView = await dbFindAllArray('erpPage', {pageName: site, pageRank: 1})
    // console.log('pageWriteView',pageWriteView)
    let pageWriteView = await dbFindAllArray('erpPage', {pageName: 'site', pageRank: 1})
    // console.log('pageWriteView',pageWriteView)
    // const data = getDataToArray(pageWriteView, 'rankOutput')
    pageWriteView = pageWriteView.sort(sortDataField('rankNumber'))

    const data = getArrayToOneData(pageWriteView, 'rankOutput')
    // console.log('data',data)
    fsFileCreate(path.join('site', `site.hbs`), data)
    res.redirect('back')
}))
// router.post('/add', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
//     console.log('add')
//     const {erpName, text, nameClass, pageName, pageEnd, _id} = req.body
//     let rankNumber = +req.body.rankNumber
//     let pageRank = +req.body.pageRank
//     // console.log('add', rankNumber)
//     let pageDetail = await dbFindAllArray('erpPage', {pageName: pageName, pageRank: pageRank})
//     // console.log('pageDetail',pageDetail)
//     let rankNumberMax = Math.max.apply(Math, pageDetail.map(function(o) { return o.rankNumber; }))
//     console.log('rankNumberMax',rankNumberMax)
//     if(_id) { // dealing with rankNumber
//         console.log('rankNumber exist')
//         // check if rankNumber equal existing
//         const erpPageData = await dbFindOneQuery('erpPage', {_id: getPrimaryKey(_id)})
//         let rankNumberOld = erpPageData.rankNumber
//         console.log('if ID rank',rankNumberOld, rankNumber)
//         // var rankNumberChange = 1
//         if(rankNumberOld != rankNumber) { // rankNumber has been changed, check rankNumbers existing and update existing
//             console.log('rankNumber changed', rankNumberOld, rankNumber)
//             if(rankNumber > rankNumberOld) { // rank New bigger rank Old; going downwards
//                 let rankOld = rankNumberOld
//                 let rankNew = rankNumber
//                 if(rankNew > rankNumberMax) {
//                     rankNew = rankNumberMax
//                 }
//                 let rankUpdate = rankNew - 1
//                 let rankSearch = rankNew
//                 while(rankSearch != rankNumberOld) {
//                     await dbFindOneIfExistUpdate('erpPage', {pageName, pageRank, 'rankNumber': rankSearch}, {'rankNumber': rankUpdate})
//                     rankUpdate--
//                     rankSearch--
//                 }
//             } else { // rank New smaller rank Old; going upwards
//                 let rankOld = rankNumberOld
//                 let rankNew = rankNumber
//                 if(rankNew < 1) { // if rank smaller than 1, set it to 1
//                     rankNew = 1
//                 }
//                 while(rankNew != rankNumberOld) {
//                     await dbFindOneIfExistUpdate('erpPage', {pageName, pageRank, 'rankNumber': rankNew}, {'rankNumber': rankNew})
//                     rankNew++
//                     rankOld++
//                 }
//             }
//         }
//     } else {
//         console.log('rankNumber NOT exist')
//         if(rankNumberMax == '-Infinity') {rankNumberMax = 0}
//         rankNumber = rankNumberMax + 1
//     }
//     console.log('rankNumber',rankNumber)
//     let rankOutput = ''
//     if(erpName == 'div') {rankOutput = div(text)}
//     if(erpName == 'divClass') {rankOutput = divClass(text, nameClass)}
//     let rankFunction = {}
//     rankFunction = {pageRank, rankNumber: rankNumber, erpName: erpName, text: text, nameClass: nameClass, pageName: pageName, pageEnd: pageEnd, rankOutput}
//     if(_id) { // if new part, use id
//         // console.log('id exist')
//         await dbFindOneUpdate('erpPage', {_id: getPrimaryKey(_id)}, rankFunction)  
//     } else {
//         // console.log('id NOT exist')
//         await dbFindOneUpdate('erpPage', {pageName, rankNumber}, rankFunction)  
//     }
//     // get all output and write to file
//     // const pageWriteView = await dbFindAllArray('erpPage', {pageName: site, pageRank: 1})
//     // console.log('pageWriteView',pageWriteView)
//     let pageWriteView = await dbFindAllArray('erpPage', {pageName: 'site', pageRank: 1})
//     // console.log('pageWriteView',pageWriteView)
//     // const data = getDataToArray(pageWriteView, 'rankOutput')
//     pageWriteView = pageWriteView.sort(sortDataField('rankNumber'))

//     const data = getArrayToOneData(pageWriteView, 'rankOutput')
//     // console.log('data',data)
//     fsFileCreate(path.join('site', `site.hbs`), data)
//     res.redirect('back')
// }))

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