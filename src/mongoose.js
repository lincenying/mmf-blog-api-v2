const mongoose = require('mongoose')

const mongoUrl = 'localhost'
mongoose.set('strictQuery', false)
mongoose.connect(`mongodb://${mongoUrl}/mmfblog_v2`, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
module.exports = mongoose
