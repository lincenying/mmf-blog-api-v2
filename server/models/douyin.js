const mongoose = require('../mongoose')
const Schema = mongoose.Schema
const Promise = require('bluebird')

const DouYinSchema = new Schema({
    user_id: String,
    aweme_id: String,
    desc: String,
    vid: String,
    image: String,
    video: String,
    creat_date: String,
    is_delete: Number,
    timestamp: Number
})

const DouYin = mongoose.model('DouYin', DouYinSchema)
Promise.promisifyAll(DouYin)
Promise.promisifyAll(DouYin.prototype)

module.exports = DouYin
