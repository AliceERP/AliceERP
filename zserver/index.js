'use strict'
require('module-alias/register') // use @folderName package.json _moduleAliases
const dotenv = require('dotenv') // .env file
dotenv.config() // using .env
const mode =  process.env.STAGE || 'development'
const PORT = process.env.PORT || 4000 
const express = require('express')
const app = express()
var router = express.Router()
app.disable('x-powered-by') // remove this string in browser inspect mode
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
// const uuid = require('uuid/v4') // random unique string generator for userID session
const { v4: uuidv4 } = require('uuid') // random unique string generator for userID session usage: uuidv4()
const https = require('https')
const fs = require('fs')
const db = require('@zserver/database') // set this in package.json _moduleAliases
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.static('public')) 
const bcrypt = require('bcryptjs')
const exphbs = require('express-handlebars')
const xmlj = require('fast-xml-parser').parse // convert xml to json: xmlj(data)
const nodemailer = require('nodemailer') // sending emails
const moment = require('moment-timezone') // for time
const momentbd = require('moment-business-days') // for business day calculations. businessDiff
const crypto = require('crypto') // hasing data; encrypt decrypt data
const zipcodes = require('zipcodes') // US zip code lookup
const ukAddress = require('uk-clear-addressing') // address format for United Kingdom
const pup = require('puppeteer') // pdf
const xlsx = require('xlsx') // excel file
const excel = require('exceljs') // generate excel files
const fuse = require('fuse.js') // fuzzy search function
const url = require('url') // built in url parser eg const pathName = url.parse(redirectUrl).pathname > pathName /account/cart/checkout
const wget = require('wget') // wget commands
const parsePhoneNumber = require('libphonenumber-js') // phone number format check

const hbs = exphbs.create({
    defaultLayout: 'main'
    , layoutsDir: './template/layout'
    , partialsDir: './template/part'
    , extname: '.hbs'
    , data: {

    }
    , helpers: {
        ifEqual: function(x, y, options) {
            return(x == y) ? options.fn(this) : options.inverse(this)
        } // {{#ifEqual statusLogin 'unconfirmed'}} {{/ifEqual}}  
        , ifNotEqual: function(x, y, options) {
            return(x != y) ? options.fn(this) : options.inverse(this)
        } // {{#ifNotEqual statusLogin 'verified'}} {{/ifNotEqual}} 
        , ifElse: function(x, y, options) {
            if(x == y) {
                return options.fn(this)
            }
            return options.inverse(this)
        } // {{#ifElse statusLogin 'unconfirmed'}} {{else}} {{/ifElse}}
        , math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        } // {{math @index "+" 1}}
        , numberFormat: function (value, options) { // numberFormat this: turn numbers into currency format
            var dl = options.hash['decimalLength'] || 2
            var ts = options.hash['thousandsSep'] || ','
            var ds = options.hash['decimalSep'] || '.'
            var value = parseFloat(value) // Parse to float
            var re = '\\d(?=(\\d{3})+' + (dl > 0 ? '\\D' : '$') + ')' // The regex
            var num = value.toFixed(Math.max(0, ~~dl)) // Formats the number with the decimals
            return (ds ? num.replace('.', ds) : num).replace(new RegExp(re, 'g'), '$&' + ts) // Returns the formatted number
        } // {{numberFormat this}} {{numberFormat data.field}}
    }
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './template/view')

var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
    uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/changeThisToYourDatabaseName'
    , collection: 'session' // collection name for storing session data
})
app.use(session({
    secret: process.env.COOKIESECRET || 'changeThisToAnythingMakeItHardToCrackWithSymbolsUppercaseLowercaseEtc'
    , cookie: {
      maxAge: 3 * 4 * 7 * 24 * 60 * 60 * 1000 // 3 months
    },
    store: store
    , secure: false // false sends cookie to browser with or without https. true send cookies to browser only if https, if no https wont send cookie
    , name: process.env.COOKIENAME ||  'cookiename'
    , resave: true // https://www.npmjs.com/package/express-session#resave
    , saveUninitialized: true // https://www.npmjs.com/package/express-session#saveuninitialized
    , httpOnly: true // make the cookie unavailable for javascript by providing the option httpOnly : true
    , genid: (req) => {
        return uuidv4()
      }   
}))

app.use(flash()) // connect flash middleware
// global variables. Creating our own middleware. Custom middleware coming from flash
app.use((req, res, next) => { // color code the message type
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', require(path.join('../homepage/homepage'))) // make route use the route file in app/home

app.use((err, req, res, next) => { // custom middleware for next function
    res.status(err.status).json({ // send error status to User in json 
        error : {
            message : err.message
        }
    })
})

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'))
    , key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}

if(mode == 'development') {
    db.connect((err) => { // connect to database
        if(err) {
            console.log('unable to connect to database')
            https.createServer(httpsOptions, app)
                .listen(PORT, function() {
                    console.log(`No database connection, but Server running https://localhost:${PORT}`)
            })
        } else { // localhost run on https
            https.createServer(httpsOptions, app)
                .listen(PORT, function() {
                    console.log(`Database connected. Server running https://localhost:${PORT}`)
            })
        }
    })
} else if (mode == 'production') {
    db.connect((err) => { // connect to database
        if(err) {
            console.log('unable to connect to database')
            // process.exit(1)     // terminate the application
            app.listen(PORT, () => {
                console.log(`No database connection, server running app listening on port ${PORT}`)
            })
        } else { // server connected to db success
            app.listen(PORT, () => {
                console.log(`Database connected. Server running app listening on port ${PORT}`)
            })
        }
    })
}

module.exports = router