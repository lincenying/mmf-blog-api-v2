const fs = require('node:fs')
const multer = require('multer')
const moment = require('moment')
const base64Img = require('base64-img')
const AipImageClassifyClient = require('baidu-aip-sdk').imageClassify
const domain = require('../config').domain
const cdnDomain = require('../config').cdnDomain
const shihuaConfig = require('../config').shihua

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, './uploads')
    },
    filename(_req, file, cb) {
        const ext = file.originalname.split('.').pop()
        cb(null, `shihua-${Date.now()}.${ext}`)
    },
})
const upload = multer({ storage }).single('file')
const checkJWT = require('../utils/check-jwt').checkJWT

const mongoose = require('../mongoose')

const Shihua = mongoose.model('Shihua')

exports.upload = async (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            res.json({ code: '-200', msg: err.toString() })
        }
        else if (err) {
            res.json({ code: '-200', msg: err.toString() })
        }
        else {
            const file = req.file
            res.json({ code: '200', url: file.path })
        }
    })
}

function getBase64(img_id, cdn) {
    if (cdn === 'qiniu') {
        return new Promise((resolve) => {
            const url = `${cdnDomain}app/${img_id}/800x800`
            base64Img.requestBase64(url, (_err, _res, body) => {
                if (body) {
                    body = body.split(',')[1]
                    resolve(body)
                }
                else {
                    resolve('')
                }
            })
        })
    }
    return fs.readFileSync(`./uploads/${img_id}`).toString('base64')
}

exports.shihua = async (req, res) => {
    const img_id = req.query.id
    const cdn = req.query.cdn
    const token = req.cookies.user || req.headers.user
    const userid = req.cookies.userid || req.headers.userid
    const username = req.cookies.username || req.headers.username
    const isLogin = await checkJWT(token, userid, username, 'user')
    const getData = async () => {
        const client = new AipImageClassifyClient(shihuaConfig.APP_ID, shihuaConfig.API_KEY, shihuaConfig.SECRET_KEY)
        try {
            console.log(`七牛图片开始时间:${new Date().getTime()}`)
            const image = await getBase64(img_id, cdn)
            console.log(`七牛图片结束时间:${new Date().getTime()}`)
            if (image) {
                const options = {}
                options.baike_num = '5'
                // 带参数调用植物识别
                console.log(`识图开始时间:${new Date().getTime()}`)
                const shihuaResult = await client.plantDetect(image, options)
                console.log(`识图结束时间:${new Date().getTime()}`)
                if (shihuaResult.result) {
                    if (isLogin) {
                        const length = shihuaResult.result.length
                        let img, name
                        for (let i = 0; i < length; i++) {
                            const item = shihuaResult.result[i]

                            if (item.baike_info && item.baike_info.image_url) {
                                name = item.name
                                img = item.baike_info.image_url
                                break
                            }
                        }
                        if (cdn === 'qiniu')
                            img = `${cdnDomain}app/${img_id}`
                        else
                            img = `${domain}uploads/${img_id}`

                        if (img && name) {
                            await Shihua.create({
                                user_id: userid,
                                img_id,
                                name,
                                img,
                                result: JSON.stringify(shihuaResult.result),
                                creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                                is_delete: 0,
                                timestamp: moment().format('X'),
                            })
                            // fs.unlinkSync('./uploads/' + img_id)
                        }
                    }
                    return {
                        success: true,
                        data: shihuaResult,
                    }
                }
                return {
                    success: false,
                    err: 'shitu',
                    message: shihuaResult.error_msg,
                }
            }
            return {
                success: false,
                err: 'down-img',
                message: '图片读取失败',
            }
        }
        catch (error) {
            return {
                success: false,
                err: 'unknow',
                message: error.message,
            }
        }
    }

    try {
        const result = await Shihua.findOne({ img_id })
        if (result) {
            res.json({
                code: 200,
                from: 'db',
                userid,
                result: JSON.parse(result.result),
            })
        }
        else {
            let data = await getData()
            if (!data.success && data.err === 'unknow')
                data = await getData()
            if (!data.success && data.err === 'unknow')
                data = await getData()
            if (data.success)
                res.json({ code: 200, from: 'api', userid, ...data.data })
            else
                res.json({ code: -200, userid, message: data.message || '读取数据失败' })
        }
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 获取识花历史列表
 * @method getHistory
 * @param  {Request} req Request
 * @param  {Response} res Response
 * @return {[type]}     [description]
 */
exports.getHistory = async (req, res) => {
    const userid = req.cookies.userid || req.headers.userid
    let { limit, page } = req.query
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)
    if (!page)
        page = 1
    if (!limit)
        limit = 10
    const payload = {
        is_delete: 0,
        user_id: userid,
    }
    const skip = (page - 1) * limit
    const sort = '-creat_date'

    try {
        let [data, total] = await Promise.all([Shihua.find(payload).sort(sort).skip(skip).limit(limit).exec(), Shihua.countDocuments(payload)])
        const totalPage = Math.ceil(total / limit)
        const json = {
            code: 200,
            data: {
                total,
                hasNext: totalPage > page ? 1 : 0,
                hasPrev: page > 1,
            },
        }
        data = data.map((item) => {
            item.result = ''
            return item
        })
        json.data.list = data
        res.json(json)
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}

/**
 * 删除识花历史列表
 * @method delHistory
 * @param  {Request} req Request
 * @param  {Response} res Response
 * @return {[type]}     [description]
 */
exports.delHistory = async (req, res) => {
    const userid = req.cookies.userid || req.headers.userid
    const { img_id } = req.query

    try {
        await Shihua.deleteOne({ img_id, user_id: userid })
        fs.unlinkSync(`./uploads/${img_id}`)
        res.json({ code: 200, message: '删除成功' })
    }
    catch (err) {
        res.json({ code: -200, message: err.toString() })
    }
}
