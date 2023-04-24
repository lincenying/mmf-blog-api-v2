const express = require('express')

const router = express.Router()
const Mock = require('mockjs')
const cors = require('../middlewares/cors')

router.get('/list', cors, (req, res) => {
    const data = Mock.mock({
        code: 200,
        data: {
            'current_page': req.query.page || 1,
            'last_page': 10,
            'total': 100,
            'data|10': [
                // order: 重复10次指定内容组成一个数组
                {
                    'id|+1': 10000, // id从10000开始，每次+1
                    'name': '@cname',
                    'title': '@ctitle(5, 10)',
                    'created_at': '@datetime',
                    'img': '@image("200x100", "#4A7BF7", "Hello")',
                },
            ],
        },
        msg: '查询成功',
    })
    res.json(data)
})

router.get('/list/empty', cors, (req, res) => {
    const data = Mock.mock({
        code: 200,
        data: {
            current_page: req.query.page || 1,
            last_page: 1,
            total: 0,
            data: [],
        },
        msg: '查询成功',
    })
    res.json(data)
})

router.get('/detail', cors, (req, res) => {
    const data = Mock.mock({
        code: 200,
        data: {
            'id|+1': 10000, // id从10000开始，每次+1
            'name': '@cname',
            'title': '@ctitle(5, 10)',
            'created_at': '@datetime',
            'img': '@image(200x200)',
            'content': '@cparagraph(10, 20)',
        },
        msg: '查询成功',
    })
    res.json(data)
})

router.get('/category', cors, (req, res) => {
    const data = Mock.mock({
        'code': 200,
        'data|10': [
            // order: 重复10次指定内容组成一个数组
            {
                'id|+1': 10000, // id从10000开始，每次+1
                'category_name': '@ctitle(3, 5)',
                'created_at': '@datetime',
            },
        ],
        'msg': '查询成功',
    })
    res.json(data)
})

module.exports = router
