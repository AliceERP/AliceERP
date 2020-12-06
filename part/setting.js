'use strict'
const db = require('@zserver/database') // access database

module.exports = {
    // erpSiteFolderName: async function(folderName) {
    //     console.log('erpSiteFolderName')
    //     const fs = require('fs-extra')
    //     const {dbFindOneUpdate, dbFindOneQuery} = require('@part/db')
    //     // check if same
    //     const folderNameCurrent = await dbFindOneQuery('setting', {setting: 'erp'})
    //     console.log('folderNameCurrent', folderNameCurrent.erpSiteFolderName)
    //     if(folderNameCurrent.erpSiteFolderName == folderName) { // same
    //         console.log('same, do nothing')
    //     } else {
    //         console.log('NOT same')
    //         // check old folder is empty or exist
    //         const checkFolderCurrentExist = fs.existsSync(folderName) // returns false
    //         console.log('checkFolderCurrentExist',checkFolderCurrentExist)
    //         if(checkFolderCurrentExist) { // 
    //             console.log('exists folder')
    //         } else {
    //             console.log('not exist')
    //             fs.mkdirSync(folderName)
    //             await dbFindOneUpdate('setting', {setting: 'erp'}, {erpSiteFolderName: folderName})  
    //         }
    //     }
    //     // check old folder name

    //     // check folder is empty
        
        
    //     // check if existing
        
    //     // if new, create new folder name
        
    //     // update everything in system that links to this

    // }
}