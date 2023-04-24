const path = require('node:path')
const express = require('express')
const compression = require('compression')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')

// 引入 mongoose 相关模型
require('./models/admin')
require('./models/article')
require('./models/category')
require('./models/comment')
require('./models/user')
require('./models/shihua')
require('./models/douyin-user')
require('./models/douyin')

// 引入 api  路由
const mockjs = require('./mockjs/index')
const routes = require('./routes/index')
const frontendRoutes = require('./routes/frontend')
const backendRoutes = require('./routes/backend')
const appRoutes = require('./routes/app')
// 引入 mock 路由

const app = express()

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
function serve(path, cache) {
    return express.static(resolve(path), {
        maxAge: (cache && isProd) ? 1000 * 60 * 60 * 24 * 30 : 0,
    })
}

// view engine setup
app.set('views', path.join(__dirname, '../views'))// twig
app.set('twig options', {
    allow_async: true,
    strict_variables: false,
})
// app.set('views', path.join(__dirname, 'views'))
// app.engine('.html', require('ejs').__express)
// app.set('view engine', 'ejs')

app.use(compression())
app.use(favicon(`${path.join(__dirname, '../public')}/favicon.ico`))
app.use(
    logger('dev', {
        skip(req) {
            return req.url.includes('.map')
        },
    }),
)
// parse application/json
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

app.use('/static', serve('../public', true))
app.use('/api/app', appRoutes)
app.use('/api/frontend', frontendRoutes)
app.use('/api/backend', backendRoutes)
app.use('/backend', routes)
app.use('/mockjs', mockjs)

app.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该页面',
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
