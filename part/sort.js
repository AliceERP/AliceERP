'use strict'
module.exports = {
    sortDataField: (property)  => {
        return function (x, y) {
            return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
        };
    }
}