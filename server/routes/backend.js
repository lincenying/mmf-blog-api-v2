const express = require('express')

const router = express.Router()
const multipart = require('connect-multiparty')

const multipartMiddleware = multipart()

const backendArticle = require('../api/backend-article')
const backendCategory = require('../api/backend-category')
const backendUser = require('../api/backend-user')

const frontendUser = require('../api/frontend-user')

const cors = require('../middlewares/cors')
const isAdmin = require('../middlewares/is-admin')

router.options('*', cors)

// API
// ================ 后台 ================
// ------- 文章 -------
// 管理时, 获取文章列表
router.get('/article/list', isAdmin, backendArticle.getList)
// 管理时, 获取单篇文章
router.get('/article/item', isAdmin, backendArticle.getItem)
// 管理时, 发布文章
router.post('/article/insert', isAdmin, multipartMiddleware, backendArticle.insert)
// 管理时, 删除文章
router.get('/article/delete', isAdmin, backendArticle.deletes)
// 管理时, 恢复文章
router.get('/article/recover', isAdmin, backendArticle.recover)
// 管理时, 编辑文章
router.post('/article/modify', isAdmin, multipartMiddleware, backendArticle.modify)
// ------- 分类 -------
// 管理时, 获取分类列表
router.get('/category/list', backendCategory.getList)
// 管理时, 获取单个分类
router.get('/category/item', backendCategory.getItem)
// 管理时, 添加分类
router.post('/category/insert', multipartMiddleware, isAdmin, backendCategory.insert)
// 管理时, 删除分类
router.get('/category/delete', isAdmin, backendCategory.deletes)
// 管理时, 恢复分类
router.get('/category/recover', isAdmin, backendCategory.recover)
// 管理时, 编辑分类
router.post('/category/modify', isAdmin, multipartMiddleware, backendCategory.modify)
// ------- 管理 -------
// 后台登录
router.post('/admin/login', multipartMiddleware, backendUser.login)
// 管理列表
router.get('/admin/list', isAdmin, backendUser.getList)
// 获取单个管理员
router.get('/admin/item', isAdmin, backendUser.getItem)
// 编辑管理员
router.post('/admin/modify', isAdmin, multipartMiddleware, backendUser.modify)
// 删除管理员
router.get('/admin/delete', isAdmin, backendUser.deletes)
// 恢复管理员
router.get('/admin/recover', isAdmin, backendUser.recover)

// 用户列表
router.get('/user/list', isAdmin, frontendUser.getList)
// 获取单个用户
router.get('/user/item', isAdmin, frontendUser.getItem)
// 编辑用户
router.post('/user/modify', isAdmin, multipartMiddleware, frontendUser.modify)
// 删除用户
router.get('/user/delete', isAdmin, frontendUser.deletes)
// 恢复用户
router.get('/user/recover', isAdmin, frontendUser.recover)

router.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该页面',
    })
})

module.exports = router
