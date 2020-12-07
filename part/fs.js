'use strict'
const fs = require('fs-extra')
const path = require('path')

module.exports = {
    fsFolderCheckCreate: (folder) => { // check folder exist, if not create
        if(!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    } // fsFolderCheckCreate(imageFolderBase) 
    , fsFileCreate: async (pathFile, data) => { // create file at folder path
        await fs.writeFile(pathFile, data)  
    } // fsFileCreate(path.join('app', name, `${name}.hbs`), existView)
}