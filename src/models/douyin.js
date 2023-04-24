const mongooseAutopopulate = require('mongoose-autopopulate')

const mongoose = require('../mongoose')

const Schema = mongoose.Schema

const DouYinSchema = new Schema(
    {
        user_id: { type: String, ref: 'DouYinUser' },
        aweme_id: String,
        desc: String,
        vid: String,
        image: String,
        video: String,
        creat_date: String,
        is_delete: Number,
        timestamp: Number,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

DouYinSchema.virtual('user', {
    ref: 'DouYinUser',
    localField: 'user_id',
    foreignField: 'user_id',
    justOne: true,
    autopopulate: { path: 'user', select: '_id user_id user_name user_avatar' },
})

DouYinSchema.plugin(mongooseAutopopulate)
const DouYin = mongoose.model('DouYin', DouYinSchema)

module.exports = DouYin
