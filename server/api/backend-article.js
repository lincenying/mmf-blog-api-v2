const moment = require('moment')
const markdownIt = require('markdown-it')
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const hljs = require('highlight.js')

const mongoose = require('../mongoose')

const Article = mongoose.model('Article')
const Category = mongoose.model('Category')

function marked(md) {
    const $return = {
        html: '',
        toc: '',
    }
    const html = markdownIt({
        breaks: true,
        html: true,
        linkify: true,
        typographer: true,
        highlight(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value
                }
                catch (error) {}
            }
            return ''
        },
    })
        .use(markdownItTocAndAnchor, {
            tocCallback(tocMarkdown, tocArray, tocHtml) {
                $return.toc = tocHtml
            },
        })
        .render(md)
    $return.html = html
    return $return
}

/**
 * 管理时, 获取文章列表
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.getList = async (req, res) => {
    const sort = '-_id'
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    try {
        const result = await Promise.all([
            Article.find().sort(sort).skip(skip).limit(limit).exec(),
            Article.countDocuments(),
        ])
        const total = result[1]
        const totalPage = Math.ceil(total / limit)
        const json = {
            code: 200,
            data: {
                list: result[0],
                total,
                hasNext: totalPage > page ? 1 : 0,
                hasPrev: page > 1 ? 1 : 0,
            },
        }
        res.json(json)
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 获取单篇文章
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.getItem = async (req, res) => {
    const _id = req.query.id
    if (!_id)
        res.json({ code: -200, message: '参数错误' })

    try {
        const result = await Article.findOne({ _id })
        res.json({ code: 200, data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 发布文章
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.insert = async (req, res) => {
    const { category, content, title } = req.body
    const md = marked(content)
    const html = md.html
    const toc = md.toc
    const arr_category = category.split('|')
    const data = {
        title,
        category: arr_category[0],
        category_name: arr_category[1],
        content,
        html,
        toc,
        visit: 0,
        like: 0,
        comment_count: 0,
        creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X'),
    }
    try {
        const result = await Article.create(data)
        await Category.updateOne({ _id: arr_category[0] }, { $inc: { cate_num: 1 } })
        res.json({ code: 200, message: '发布成功', data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 删除文章
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.deletes = async (req, res) => {
    const _id = req.query.id
    try {
        const result = await Article.updateOne({ _id }, { is_delete: 1 })
        await Category.updateOne({ _id }, { $inc: { cate_num: -1 } })
        res.json({ code: 200, message: '更新成功', data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 恢复文章
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.recover = async (req, res) => {
    const _id = req.query.id
    try {
        const result = await Article.updateOne({ _id }, { is_delete: 0 })
        await Category.updateOne({ _id }, { $inc: { cate_num: 1 } })
        res.json({ code: 200, message: '更新成功', data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理时, 编辑文章
 * @method
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.modify = async (req, res) => {
    const { id, category, category_old, content, title, category_name } = req.body
    const md = marked(content)
    const html = md.html
    const toc = md.toc
    const data = {
        title,
        category,
        category_name,
        content,
        html,
        toc,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    try {
        const result = await Article.findOneAndUpdate({ _id: id }, data, { new: true })
        if (category !== category_old) {
            await Promise.all([
                Category.updateOne({ _id: category }, { $inc: { cate_num: 1 } }),
                Category.updateOne({ _id: category_old }, { $inc: { cate_num: -1 } }),
            ])
        }
        res.json({ code: 200, message: '更新成功', data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}
