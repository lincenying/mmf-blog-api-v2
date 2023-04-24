const axios = require('axios')
const cheerio = require('cheerio')
const config = require('../config')

const baseOptions = {
    method: 'GET',
    url: 'https://www.tujidao.com/',
    headers: {
        'Referer': 'https://www.tujidao.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
        'upgrade-insecure-requests': 1,
    },
}

exports.lists = async (req, res) => {
    const cookies = config.tujidao
    const page = req.query.page || 1
    const options = {
        ...baseOptions,
        method: 'GET',
        url: `https://www.tujidao.com/cat/?id=10&page=${page}`,
        headers: {
            ...baseOptions.headers,
            cookie: cookies,
        },
    }
    try {
        const xhr = await axios(options)
        const body = xhr.data
        const $ = cheerio.load(body)
        const list = []
        $('.hezi')
            .find('li')
            .each((index, item) => {
                const data = {}
                data.id = $(item).attr('id')
                data.title = $(item).find('.biaoti').text()
                data.img = $(item).find('img').eq(0).attr('src')
                data.total = $(item).find('.shuliang').eq(0).text().replace('P', '').replace('p', '')
                list.push(data)
            })
        res.json({
            code: 200,
            data: list,
        })
    }
    catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}
