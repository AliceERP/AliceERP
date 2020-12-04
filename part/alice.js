'use strict'
module.exports = {
    aliceAsyncMiddleware: fn => // no need for try and catch blocks, does catch block automatically
        (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next)
        }
    }