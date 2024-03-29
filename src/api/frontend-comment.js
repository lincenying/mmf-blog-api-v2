const moment = require('moment')

const CommentM = require('../models/comment')
const ArticleM = require('../models/article')

/**
 * 发布评论
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.insert = async (req, res) => {
    const userid = req.cookies.userid || req.headers.userid
    const { id, content } = req.body
    const creat_date = moment().format('YYYY-MM-DD HH:mm:ss')
    const timestamp = moment().format('X')
    if (!id) {
        res.json({ code: -200, message: '参数错误' })
        return
    }
    else if (!content) {
        res.json({ code: -200, message: '请输入评论内容' })
        return
    }
    const data = {
        article_id: id,
        userid,
        content,
        creat_date,
        is_delete: 0,
        timestamp,
    }
    try {
        const result = await CommentM.create(data)
        await ArticleM.updateOne(
            { _id: id },
            {
                $inc: {
                    comment_count: 1,
                },
            },
        )
        res.json({ code: 200, data: result, message: '发布成功' })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 前台浏览时, 读取评论列表
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.getList = async (req, res) => {
    const { all, id } = req.query
    let { limit, page } = req.query
    if (!id) {
        res.json({ code: -200, message: '参数错误' })
    }
    else {
        page = parseInt(page, 10)
        limit = parseInt(limit, 10)
        if (!page)
            page = 1
        if (!limit)
            limit = 10
        const data = {
            article_id: id,
        }
        const skip = (page - 1) * limit
        if (!all)
            data.is_delete = 0

        try {
            const [list, total] = await Promise.all([
                CommentM.find(data).sort('-_id').skip(skip).limit(limit).exec(),
                CommentM.countDocuments(data),
            ])
            const totalPage = Math.ceil(total / limit)
            const json = {
                code: 200,
                data: {
                    list,
                    total,
                    hasNext: totalPage > page ? 1 : 0,
                },
            }
            res.json(json)
        }
        catch (err) {
            res.json({ code: -200, message: err.toString() })
        }
    }
}

/**
 * 评论删除
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.deletes = async (req, res) => {
    const _id = req.query.id
    try {
        await Promise.all([
            CommentM.updateOne({ _id }, { is_delete: 1 }),
            ArticleM.updateOne({ _id }, { $inc: { comment_count: -1 } }),
        ])
        res.json({ code: 200, message: '删除成功', data: 'success' })
    }
    catch (err) {
        res.json({
            code: -200,
            message: err.toString(),
        })
    }
}

/**
 * 评论恢复
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.recover = async (req, res) => {
    const _id = req.query.id
    try {
        await Promise.all([
            CommentM.updateOne({ _id }, { is_delete: 0 }),
            ArticleM.updateOne({ _id }, { $inc: { comment_count: 1 } }),
        ])
        res.json({ code: 200, message: '恢复成功', data: 'success' })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}
