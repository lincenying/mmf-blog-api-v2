const moment = require('moment')
const mongoose = require('../mongoose')

const Category = mongoose.model('Category')

/**
 * 管理时, 获取分类列表
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.getList = async (req, res) => {
    try {
        const result = await Category.find().sort('-cate_order').exec()
        const json = {
            code: 200,
            data: {
                list: result,
            },
        }
        res.json(json)
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 获取分类详情
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.getItem = async (req, res) => {
    const _id = req.query.id
    if (!_id)
        res.json({ code: -200, message: '参数错误' })

    try {
        const result = await Category.findOne({ _id })
        res.json({ code: 200, data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 新增分类
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.insert = async (req, res) => {
    const cate_name = req.body.cate_name
    const cate_order = req.body.cate_order
    if (!cate_name || !cate_order) {
        res.json({ code: -200, message: '请填写分类名称和排序' })
    }
    else {
        try {
            const result = await Category.create({
                cate_name,
                cate_order,
                cate_num: 0,
                creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                is_delete: 0,
                timestamp: moment().format('X'),
            })
            res.json({ code: 200, message: '添加成功', data: result })
        }
        catch (err) {
            res.json({ code: -200, message: err.toString() })
        }
    }
}

/**
 * 管理时, 删除分类
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.deletes = async (req, res) => {
    const _id = req.query.id
    try {
        await Category.updateOne({ _id }, { is_delete: 1 })
        res.json({ code: 200, message: '更新成功', data: 'success' })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 恢复分类
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.recover = async (req, res) => {
    const _id = req.query.id
    try {
        await Category.updateOne({ _id }, { is_delete: 0 })
        res.json({ code: 200, message: '更新成功', data: 'success' })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 编辑分类
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.modify = async (req, res) => {
    const id = req.body.id
    const cate_name = req.body.cate_name
    const cate_order = req.body.cate_order
    try {
        const result = await Category.findOneAndUpdate(
            { _id: id },
            {
                cate_name,
                cate_order,
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
            { new: true },
        )
        res.json({ code: 200, message: '更新成功', data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}
