const mongoose = require('../mongoose')

const Schema = mongoose.Schema

const ShihuaSchema = new Schema({
    user_id: String,
    img_id: String,
    name: String,
    img: String,
    result: String,
    creat_date: String,
    is_delete: Number,
    timestamp: Number,
})

const Shihua = mongoose.model('Shihua', ShihuaSchema)

module.exports = Shihua
