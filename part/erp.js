'use strict'
module.exports = {
    div: (text) => { // 
        return `
        <div>${text}</div>
        `
    }
    , divClass: (text, nameClass) => { // 
        return `
        <div class='${nameClass}'>${text}</div>
        `            
    }
}