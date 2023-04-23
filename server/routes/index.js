const express = require('express')

const router = express.Router()
const backendUser = require('../api/backend-user')

// 添加管理员
router.get('/', (req, res) => {
    res.render('admin-add.html', { title: '添加管理员', message: '' })
})
router.post('/', (req, res) => {
    backendUser.insert(req, res)
})

router.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该页面',
    })
})

module.exports = router
