const express = require('express')

const router = express.Router()

const appPublic = require('../app/app-public')
const appShihua = require('../app/app-shihua')
const appWeiBo = require('../app/app-weibo')
const appTujidao = require('../app/app-tujidao')
const appQiniu = require('../app/app-qiniu')
const appDouYin = require('../app/app-douyin')

const cors = require('../middlewares/cors')
const isUser = require('../middlewares/is-user')

router.options('*', cors)

// API
// ================= APP =================
// ------- 检测版本更新 ------
router.get('/check', cors, appPublic.checkUpdate)

// ------ 识花 ------
router.post('/shihua/upload', cors, appShihua.upload)
router.get('/shihua/get', cors, appShihua.shihua)
router.get('/shihua/history/list', cors, isUser, appShihua.getHistory)
router.get('/shihua/history/delete', cors, isUser, appShihua.delHistory)
// ------ 微博 ------
router.get('/weibo/list', cors, appWeiBo.list)
router.get('/weibo/get', cors, appWeiBo.get)
router.get('/weibo/user', cors, appWeiBo.user)
router.get('/weibo/card', cors, appWeiBo.card)
router.get('/weibo/video', cors, appWeiBo.video)
router.get('/weibo/beauty-video', cors, appWeiBo.beautyVideo)
router.get('/weibo/detail', cors, appWeiBo.detail)
// ------ 图集岛 ------
router.get('/tujidao/lists', cors, appTujidao.lists)
// ------ 七牛 token -----
router.get('/qiniu/token', cors, appQiniu.token)
// ------ 抖音视频 -------
router.post('/douyin/user/insert', cors, appDouYin.insertUser)
router.post('/douyin/insert', cors, appDouYin.insert)
router.get('/douyin/list', cors, appDouYin.getList)
router.get('/douyin/item', cors, appDouYin.getItem)

router.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该页面',
    })
})

module.exports = router
