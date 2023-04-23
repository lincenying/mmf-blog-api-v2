const mongoose = require('../mongoose')

const Schema = mongoose.Schema

const DouYinUserSchema = new Schema({
    user_id: String,
    user_name: String,
    user_avatar: String,
    sec_uid: String,
    share_url: String,
    creat_date: String,
    is_delete: Number,
    timestamp: Number,
})

const DouYinUser = mongoose.model('DouYinUser', DouYinUserSchema)

module.exports = DouYinUser
