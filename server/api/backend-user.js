const fs = require('node:fs')
const md5 = require('md5')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const mongoose = require('../mongoose')
const fsExistsSync = require('../utils').fsExistsSync
const config = require('../config')

const Admin = mongoose.model('Admin')
const md5Pre = config.md5Pre
const secret = config.secretServer

/**
 * 获取管理员列表
 * @method getList
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
            Admin.find().sort(sort).skip(skip).limit(limit).exec(),
            Admin.countDocuments(),
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
 * 获取单个管理员
 * @method getItem
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.getItem = async (req, res) => {
    const _id = req.query.id
    if (!_id)
        res.json({ code: -200, message: '参数错误' })

    try {
        const result = await Admin.findOne({ _id })
        res.json({ code: 200, data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理员登录
 * @method loginAdmin
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.login = async (req, res) => {
    const { password, username } = req.body
    if (username === '' || password === '')
        return res.json({ code: -200, message: '请输入用户名和密码' })

    try {
        const result = await Admin.findOne({
            username,
            password: md5(md5Pre + password),
            is_delete: 0,
        })
        if (result) {
            const _username = encodeURI(username)
            const id = result._id.toString()
            const remember_me = 2592000000
            const token = jwt.sign({ id, username: _username }, secret, { expiresIn: 60 * 60 * 24 * 30 })
            res.cookie('b_user', token, { maxAge: remember_me })
            res.cookie('b_userid', id, { maxAge: remember_me })
            res.cookie('b_username', _username, { maxAge: remember_me })
            return res.json({ code: 200, message: '登录成功', data: token })
        }
        return res.json({ code: -200, message: '用户名或者密码错误' })
    }
    catch (error) {
        res.json({ code: -200, message: error.toString() })
    }
}

/**
 * 初始化时添加管理员
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} username 用户名
 */
exports.insert = async (email, password, username) => {
    let message = ''

    if (fsExistsSync('./admin.lock')) {
        message = '请先把 admin.lock 删除'
    }
    else if (!username || !password || !email) {
        message = '请将表单填写完整'
    }
    else {
        try {
            const result = await Admin.findOne({ username })
            if (result)
                message = `${username}: 已经存在`

            await Admin.create({
                username,
                password: md5(md5Pre + password),
                email,
                creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                is_delete: 0,
                timestamp: moment().format('X'),
            })
            fs.writeFileSync('./admin.lock', username)
            message = `添加用户成功: ${username}, 密码: ${password}`
        }
        catch (error) {
            message = error.toString()
        }
    }
    return message
}

/**
 * 管理员编辑
 * @method modifyAdmin
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.modify = async (req, res) => {
    const { id, email, password, username } = req.body
    const data = {
        email,
        username,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    if (password)
        data.password = md5(md5Pre + password)

    try {
        const result = await Admin.findOneAndUpdate({ _id: id }, data, { new: true })
        res.json({ code: 200, message: '更新成功', data: result })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理员删除
 * @method deletes
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.deletes = async (req, res) => {
    const _id = req.query.id
    try {
        await Admin.updateOne({ _id }, { is_delete: 1 })
        res.json({ code: 200, message: '删除成功', data: 'success' })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 管理员恢复
 * @method recover
 * @param  {Request} req Request
 * @param  {Response} res Response
 */
exports.recover = async (req, res) => {
    const _id = req.query.id
    try {
        await Admin.updateOne({ _id }, { is_delete: 0 })
        res.json({ code: 200, message: '恢复成功', data: 'success' })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}
