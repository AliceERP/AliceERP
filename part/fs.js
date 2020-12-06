'use strict'
const fs = require('fs-extra')
const path = require('path')

module.exports = {
    fsFolderCheckCreate: (folder) => { // check folder exist, if not create
        if(!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    } // fsFolderCheckCreate(imageFolderBase) 
}