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

router.post('/erpsitename', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    console.log('erpsitename')
    const {erpSiteFolderName} = req.body
    console.log('erpSiteFolderName',erpSiteFolderName)
    await dbFindOneUpdate('setting', {setting: 'erp'}, {erpSiteFolderName: erpSiteFolderName})  
    req.flash('success_msg', 'Success: ERP Site Folder Name updated.') // store msg in session and show it after redirect
    res.redirect('back')
}))

router.post('/superadmindelete/:username', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    // console.log('superadmindelete')
    const {username} = req.params
    // console.log('username',username)
    dbFindOneDelete('user', {username: username}) 
    req.flash('success_msg', 'Success: Super Admin User deleted.') // store msg in session and show it after redirect
    res.redirect('back')
}))

router.post('/superadmin', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    console.log('superadmin')
    const {username, password} = req.body
    // console.log('superadmin', username, password)
    const existUser = await dbFindOneQuery('user', {username: username})
    if(existUser) {
        req.flash('error_msg', 'Error: Username already taken.') // store msg in session and show it after redirect
        res.redirect('back')
    } else {
        const permission = process.env.ADMIN_PERMISSION
        const hashedPassword = await bcrypt.hash(password, 10) // saltRounds = 10
        await dbFindOneUpdate('user', {username: username}, {password: hashedPassword, permission: permission})  
        req.flash('success_msg', 'Super Admin User created Successfully.') // store msg in session and show it after redirect
        // console.log('superadminFinish')
        res.redirect('back')
    }
}))

router.get('/', pAdminSuper, aliceAsyncMiddleware(async(req, res) => {
    const userSuperAdmin = await dbFindAllArray('user', {permission: `${process.env.ADMIN_PERMISSION}`})
    const settingErp = await dbFindOneQuery('setting', {setting: 'erp'})
    // console.log('userSuperAdmin',userSuperAdmin)
    res.render(path.join(__dirname, `${__appName}`), {
        title: 'Settings | Alice ERP'
        , layout: 'aliceerp'
        , userSuperAdmin
        , settingErp
    })
}))