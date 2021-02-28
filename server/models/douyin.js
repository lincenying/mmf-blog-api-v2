const mongoose = require('../mongoose')
const Schema = mongoose.Schema

const DouYinSchema = new Schema({
    user_id: String,
    user_name: String,
    user_avatar: String,
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

module.exports = DouYin
