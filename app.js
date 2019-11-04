const express = require('express')
const compression = require('compression')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// 引入 mongoose 相关模型
require('./server/models/admin')
require('./server/models/article')
require('./server/models/category')
require('./server/models/comment')
require('./server/models/user')
require('./server/models/shihua')

// 引入 api 路由
const routes = require('./server/routes/index')

const app = express()

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const serve = (path, cache) =>
    express.static(resolve(path), {
        maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
    })

// view engine setup
app.set('views', path.join(__dirname, 'dist'))
app.engine('.html', require('ejs').__express)
app.set('view engine', 'ejs')

app.use(compression())
app.use(favicon(path.join(__dirname, 'dist') + '/favicon.ico'))
app.use(
    logger('dev', {
        skip(req) {
            return req.url.indexOf('.map') !== -1
        }
    })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'dist')))

app.use('/static', serve('./static', true))
app.use('/api', routes)

app.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该页面'
    })
})

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     const err = new Error('Not Found')
//     err.status = 404
//     next(err)
// })

// app.use(function(err, req, res) {
//     res.status(err.status || 500)
//     res.send(err.message)
// })

module.exports = app
