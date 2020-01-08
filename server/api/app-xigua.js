const cheerio = require('cheerio')
const rp = require('request-promise')
const crc32 = require('../utils/crc32')
const lruCache = require('../utils/lru-cache').xiguaCache

const getList = async num => {
    if (num > 3) return null
    try {
        const arr_id = [
            {
                id: '6765413430267628812',
                user: 'W女王日记'
            },
            {
                id: '6775421127201148171',
                user: '杭城街拍'
            },
            {
                id: '6769489349416422663',
                user: '杭城街拍'
            },
            {
                id: '6535775402772660743',
                user: '小耳朵舞蹈'
            },
            {
                id: '6778047199881350404',
                user: 'big晓梦艺'
            }
        ]
        const tmp = arr_id[Math.floor(Math.random() * arr_id.length)]
        const options = {
            method: 'GET',
            uri: 'https://www.ixigua.com/i' + tmp.id,
            headers: {
                Referer: 'referer: https://www.ixigua.com/',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                cookie:
                    'wafid=b91cc9ea-f8c9-4665-aefd-5eb32504c548; wafid.sig=6RJyXryyR309k1jBSiRHNOIUbWg; xiguavideopcwebid=6779498568983889411; xiguavideopcwebid.sig=thxI4ay_N8VBsX1clmDdpMXPDf8; SLARDAR_WEB_ID=bc0b73ca-1788-4689-b919-05355f8a0021',
                'upgrade-insecure-requests': 1
            }
        }
        const body = await rp(options)
        const $ = cheerio.load(body)
        const data = $('#SSR_HYDRATED_DATA').html()
        const json = JSON.parse(data)
        const arr = json.Projection.video.related_video_toutiao.slice(0, 10)
        return arr.map(item => {
            const imgid = item.middle_image.url.split('/').splice(-2, 2)
            return {
                from: tmp,
                item_id: item.item_id,
                title: item.title,
                user: item.source,
                m_image: item.middle_image.url,
                b_image: 'https://p2.pstatp.com/video1609/' + imgid.join('/'),
                vid: item.video_detail_info.video_id,
                video: ''
            }
        })
    } catch (error) {
        return getList(num + 1)
    }
}

exports.getList = async (req, res) => {
    const list = await getList(1)
    if (list) {
        res.json({ code: 200, msg: '', data: list })
    } else {
        res.json({ code: 300, msg: '读取列表失败', data: null })
    }
}

exports.getItem = async (req, res) => {
    const vid = req.query.id
    if (!vid) {
        res.json({ ok: 2, msg: '参数错误' })
        return
    }
    let main_url = lruCache.get('xigua_' + vid)
    if (main_url) {
        return res.json({
            code: 200,
            data: main_url,
            msg: ''
        })
    }

    const url = '/video/urls/v/1/toutiao/mp4/' + vid + '?r=' + new Date().getTime()
    const crc = crc32(url)
    const fullUrl = 'http://i.snssdk.com' + url + '&s=' + crc
    const options = {
        method: 'GET',
        uri: fullUrl,
        headers: {
            Referer: 'referer: https://www.ixigua.com/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
            cookie:
                'wafid=b91cc9ea-f8c9-4665-aefd-5eb32504c548; wafid.sig=6RJyXryyR309k1jBSiRHNOIUbWg; xiguavideopcwebid=6779498568983889411; xiguavideopcwebid.sig=thxI4ay_N8VBsX1clmDdpMXPDf8; SLARDAR_WEB_ID=bc0b73ca-1788-4689-b919-05355f8a0021',
            'upgrade-insecure-requests': 1
        },
        json: true
    }
    try {
        const json = await rp(options)
        if (json.data.video_list && json.data.video_list.video_3) main_url = json.data.video_list.video_3.main_url
        else if (json.data.video_list && json.data.video_list.video_2) main_url = json.data.video_list.video_2.main_url
        else if (json.data.video_list && json.data.video_list.video_1) main_url = json.data.video_list.video_1.main_url
        if (main_url) {
            main_url = Buffer.from(main_url, 'base64').toString()
        }
        if (main_url) {
            lruCache.set('xigua_' + vid, main_url)
        }
        res.json({
            code: 200,
            data: main_url,
            msg: ''
        })
    } catch (error) {
        res.json({ code: 300, data: '', msg: error.toString() })
    }
}
