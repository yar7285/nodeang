const express  = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

// const cors  = require('cors')
// const morgan = require('morgan')

const keys = require('./config/keys')
const authRoutes = require('./routes/auth')
const analiticsRoutes = require('./routes/analitics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')

mongoose.connect(keys.mongoURI) // todo: mongoDB
    .then(() => {
        console.log('Mongo conected ...')
    })
    .catch(error => console.log('error mongo DB'))

const app = express()

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads')) // прямой дочтуп к картинкам с base url
app.use(require('cors')())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/analytic', analiticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

module.exports = app