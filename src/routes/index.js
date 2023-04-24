const express = require('express')
const backendUser = require('../api/backend-user')

const router = express.Router()

// 添加管理员
router.get('/', (req, res) => {
    return res.render('index.twig', { title: '添加管理员', message: '' })
})
router.post('/', async (req, res) => {
    const { email, password, username } = req.body
    const message = await backendUser.insert(email, password, username)
    return res.render('index.twig', { title: '添加管理员', message })
})

router.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该页面',
    })
})

module.exports = router
