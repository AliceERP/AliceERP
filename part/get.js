'use strict'
module.exports = {
    getFunctionName: (data) => { // get function name eg name: (data); filters ending :, next start (
        let splitSpace = data.split(' ') // split space
        // console.log('splitSpace',splitSpace)
        let splitSpaceNotEmpty = splitSpace.filter(x => { // remove all empty values, return only data with values
            return x
        })
        let functionName = []
        for(let i = 0; i < splitSpaceNotEmpty.length; i++) {
            // let semicolonFind = 
            if(splitSpaceNotEmpty[i].slice(-1) == ':') {
                // console.log('yes', splitSpaceNotEmpty[i], [i])
                // check if next value starts with (
                // console.log('splitSpaceNotEmpty[i+1].slice(0)',splitSpaceNotEmpty[i+1].charAt(0))
                if(splitSpaceNotEmpty[i+1].charAt(0) == '(') {
                    // console.log('yes2', splitSpaceNotEmpty[i+1], splitSpaceNotEmpty[i+1].charAt(0))
                    // console.log('yes2', splitSpaceNotEmpty[i].slice(0, -1))
                    functionName.push(splitSpaceNotEmpty[i].slice(0, -1))
                }
            }
        }
        // console.log('functionName',functionName)
        return functionName
    } // const functionName = getFunctionName(fileErp)
}