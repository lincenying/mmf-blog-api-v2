const axios = require('axios')

const baseOptions = {
    method: 'get',
    headers: {
        'Referer': 'https://m.weibo.cn/',
        'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        'cookie': 'SCF=Aip1F5fqYgfG7nzFqjK3Umxcyp0ztYFLhFYqAAQMvjFPG0UhUj0fJHdp0A7j7wfLwTXfaHg_dOII1ioFQajhYGE.; SUHB=0qjkPHiLu6EcDR; WEIBOCN_FROM=1110003030; SSOLoginState=1546322762; MLOGIN=0; _T_WM=7a00598bc69860f7c6aa9c5beabe7f23; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D102803_ctg1_4388_-_ctg1_4388%26fid%3D102803_ctg1_4388_-_ctg1_4388%26uicode%3D10000011',
        'upgrade-insecure-requests': 1,
    },
}

// 9宫格列表
exports.list = async (req, res) => {
    // 1076036854123113 女神instagram https://m.weibo.cn/u/6854123113
    // 1076035647574056 宅男集中处 https://m.weibo.cn/u/5647574056
    // 1076035616641142 翘萌妹 https://m.weibo.cn/u/5616641142
    // 1076036572060239 污学妹的日常 https://m.weibo.cn/u/6572060239
    // 1076035561742017 尤物相馆 https://m.weibo.cn/u/5561742017
    // 1076036224138199 拍妹儿 https://m.weibo.cn/u/6224138199
    // 1076037340370622 Charlie菠萝 https://m.weibo.cn/u/7340370622
    // 1076036439828507 花季美少女 https://m.weibo.cn/u/6439828507 视频
    // 1076035236096816 宅男电影工厂 https://m.weibo.cn/u/5236096816 视频
    // 1076035235871265 视频师妹 https://m.weibo.cn/u/5235871265 视频
    // 1076035592899982 内涵视频 https://m.weibo.cn/u/5592899982 视频
    // 1076031896923211 美女II https://m.weibo.cn/u/1896923211 视频
    // 1076036879266735 热舞女神视频 https://m.weibo.cn/u/6879266735 视频
    // 1076035277695161 性感女神吖 https://m.weibo.cn/u/5277695161 视频
    const list = [
        // 性感滴美女
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m67vz8j305k05k3yp.jpg', text: '性感女神吖', cardId: ['', '', '1076035277695161'] },
        // 尤物相馆
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m67sbvj305k05kwes.jpg', text: '尤物相馆', cardId: ['', '', '1076035561742017'] },
        // 拍妹儿
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m67yfmj305k05kjrl.jpg', text: '拍妹儿', cardId: ['', '', '1076036224138199'] },
        // 街拍跟屁虫
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m68hvwj305k05k0sv.jpg', text: '领先女神范', cardId: ['', '', '1076035605527095'] },
        // 美图阁
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m67z2sj305k05kmxe.jpg', text: '套图集', cardId: ['', '', '1076036008403359'] },
        // bikini女神
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m68zqgj305k05kwet.jpg', text: 'bikini女神', cardId: ['', '', '1076035588555086'] },
        // 美女模特秀
        {
            url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m6bypfj305k05kwew.jpg',
            text: '美女模特秀',
            cardId: ['7578484496998401', '1672537', ''],
        },
        // Bikini写真 https://m.weibo.cn/u/5605506361
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m6ein7j305k05kdg6.jpg', text: 'Bikini写真', cardId: ['', '', '1076035605506361'] },
        // 视频师妹
        { url: 'https://tva1.sinaimg.cn/large/005uQRNCly1gxl8m6cquzj305k05k0tn.jpg', text: '视频师妹', cardId: ['', '', '1076035235871265'] },
    ]
    res.json({
        code: 200,
        data: list,
    })
}

// 热门微博
exports.get = async (req, res) => {
    const page = req.query.page || 0
    const options = {
        ...baseOptions,
        url: 'https://m.weibo.cn/api/container/getIndex?containerid=102803_ctg1_4388_-_ctg1_4388&openApp=0',
    }
    if (page)
        options.url += `&since_id=${page}`
    try {
        const xhr = await axios(options)
        const body = xhr.data
        res.json({
            ...body,
            code: 200,
            total: body.data.cardlistInfo.total,
            data: body.data.cards
                .filter(item => item.card_type === 9)
                .map((item) => {
                    let video = ''
                    let video_img = ''
                    let pics = ''
                    let text = ''
                    if (item.mblog) {
                        if (item.mblog.page_info && item.mblog.page_info.media_info) {
                            video
                                = item.mblog.page_info.media_info.mp4_720p_mp4
                                || item.mblog.page_info.media_info.mp4_hd_url
                                || item.mblog.page_info.media_info.mp4_sd_url
                                || item.mblog.page_info.media_info.stream_url
                            video_img = item.mblog.page_info.page_pic.url
                        }
                        pics = item.mblog.pics
                        text = item.mblog.text.replace(/"\/\//g, '"https://')
                    }
                    return {
                        itemid: item.itemid,
                        pics,
                        text,
                        video,
                        video_img,
                    }
                })
                .filter(item => item.itemid !== ''),
        })
    }
    catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

// 微博用户
exports.user = async (req, res) => {
    const containerid = req.query.containerid
    const since_id = req.query.since_id
    if (!containerid) {
        res.json({ ok: 2, msg: '参数错误' })
        return
    }
    const options = {
        ...baseOptions,
        url: `https://m.weibo.cn/api/container/getIndex?containerid=${containerid}&since_id=${since_id}`,
    }
    try {
        const xhr = await axios(options)
        const body = xhr.data
        const list = []
        body.data.cards.forEach((item) => {
            if (item.mblog) {
                const mblog = item.mblog.retweeted_status || item.mblog
                let video = ''
                let video_img = ''
                if (mblog.page_info && mblog.page_info.urls) {
                    video = mblog.page_info.urls
                    video_img = mblog.page_info.page_pic.url
                }
                else if (mblog.page_info && mblog.page_info.media_info) {
                    video
                        = mblog.page_info.media_info.mp4_720p_mp4
                        || mblog.page_info.media_info.mp4_hd_url
                        || mblog.page_info.media_info.mp4_sd_url
                        || mblog.page_info.media_info.stream_url
                    video_img = mblog.page_info.page_pic.url
                }
                const pics = (mblog.pics && mblog.pics.map(item => ({ url: item.url, large: item.large.url }))) || null
                if (pics || video) {
                    list.push({
                        id: mblog.mid,
                        itemid: mblog.mid,
                        pics,
                        text: mblog.text.replace(/"\/\//g, '"https://'),
                        video,
                        video_img,
                    })
                }
            }
        })
        res.json({
            ...body,
            code: 200,
            total: body.data.cardlistInfo.total,
            since_id: body.data.cardlistInfo.since_id,
            data: {
                ...body.data.cardlistInfo,
                content: list,
            },
        })
    }
    catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

// 微博卡片
exports.card = async (req, res) => {
    const card_id = req.query.card_id
    const block_id = req.query.block_id
    const page = req.query.page || 1
    if (!card_id || !block_id) {
        res.json({ ok: 2, msg: '参数错误' })
        return
    }
    const options = {
        ...baseOptions,
        url: `https://m.weibo.cn/api/novelty/feed/getblock?card_id=${card_id}&block_id=${block_id}&page=${page}`,
    }
    try {
        const xhr = await axios(options)
        const body = xhr.data
        const list = []
        body.data.content.forEach((item) => {
            let video = ''
            let video_img = ''
            if (item.data.page_info && item.data.page_info.urls) {
                video = item.data.page_info.urls
                video_img = item.data.page_info.page_pic.url
            }
            else if (item.data.page_info && item.data.page_info.media_info) {
                video = item.data.page_info.media_info
                video_img = item.data.page_info.page_pic.url
            }
            const pics = (item.data.pics && item.data.pics.map(item => ({ url: item.url, large: item.large.url }))) || null
            if (video || pics) {
                list.push({
                    id: item.mid,
                    pics,
                    text: item.data.text.replace(/"\/\//g, '"https://'),
                    video,
                    video_img,
                })
            }
        })
        res.json({
            ...body,
            code: 200,
            total: body.data.total,
            data: {
                ...body.data,
                content: list,
            },
        })
    }
    catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

// https://m.weibo.cn/p/100808f334edf14a66a4e3aa1a31dade762d19/super_index
// 超话视频

exports.video = async (req, res) => {
    const since_id = req.query.since_id || ''
    const options = {
        ...baseOptions,
        url: `https://m.weibo.cn/api/container/getIndex?containerid=100808f334edf14a66a4e3aa1a31dade762d19_-_feed&extparam=%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&luicode=10000011&lfid=100103type%3D1%26q%3D%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&since_id=${since_id}`,
    }
    try {
        const xhr = await axios(options)
        const body = xhr.data
        const $list = []
        body.data.cards.forEach((item) => {
            if (item.card_group && Array.isArray(item.card_group)) {
                item.card_group.forEach((sub_item) => {
                    let video = ''
                    let video_img = ''
                    if (sub_item.mblog && sub_item.mblog.page_info && sub_item.mblog.page_info.media_info) {
                        video
                            = sub_item.mblog.page_info.media_info.mp4_720p_mp4
                            || sub_item.mblog.page_info.media_info.mp4_hd_url
                            || sub_item.mblog.page_info.media_info.mp4_sd_url
                            || sub_item.mblog.page_info.media_info.stream_url
                        video_img = sub_item.mblog.page_info.page_pic.url
                        $list.push({
                            itemid: sub_item.mblog.id,
                            pics: sub_item.mblog.pics,
                            text: sub_item.mblog.text.replace(/"\/\//g, '"https://'),
                            video,
                            video_img,
                        })
                    }
                })
            }
        })
        const $return = {
            ...body,
            code: 200,
            since_id: body.data.pageInfo.since_id,
            data: $list,
            total: body.data.pageInfo.total,
        }
        res.json($return)
    }
    catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

// 231522type=64&q=#尤物#&t=0 => 231522type%3D64%26q%3D%23%E5%B0%A4%E7%89%A9%23%26t%3D0
// 100103type=64&q=#美女#&t=0 => 100103type%3D64%26q%3D%23%E7%BE%8E%E5%A5%B3%23%26t%3D0
// 微博搜索视频
exports.beautyVideo = async (req, res) => {
    const key = encodeURIComponent(req.query.key)
    const page = req.query.page || 1
    const options = {
        ...baseOptions,
        url: `https://m.weibo.cn/api/container/getIndex?containerid=${key}&page_type=searchall&page=${page}`,
    }
    try {
        const xhr = await axios(options)
        const body = xhr.data
        const $list = []
        const cardsLength = (body.data.cards && body.data.cards.length) || 0
        if (cardsLength > 0) {
            const cards = body.data.cards[cardsLength - 1]
            if (cards && cards.card_group && Array.isArray(cards.card_group)) {
                cards.card_group.forEach((sub_item) => {
                    let video = ''
                    let video_img = ''
                    if (sub_item.mblog && sub_item.mblog.page_info && sub_item.mblog.page_info.media_info) {
                        video
                            = sub_item.mblog.page_info.media_info.mp4_720p_mp4
                            || sub_item.mblog.page_info.media_info.mp4_hd_url
                            || sub_item.mblog.page_info.media_info.mp4_sd_url
                            || sub_item.mblog.page_info.media_info.stream_url
                        video_img = sub_item.mblog.page_info.page_pic.url
                        $list.push({
                            itemid: sub_item.mblog.id,
                            pics: sub_item.mblog.pics,
                            text: sub_item.mblog.text.replace(/"\/\//g, '"https://'),
                            video,
                            video_img,
                        })
                    }
                })
            }
        }
        const $return = {
            ...body,
            code: 200,
            next_page: body.data.cardlistInfo.page,
            data: $list,
            total: body.data.cardlistInfo.total,
        }
        res.json($return)
    }
    catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

// 微博详情
exports.detail = async (req, res) => {
    const id = req.query.id
    if (!id) {
        res.json({ code: 301, ok: 2, msg: '参数错误' })
        return
    }
    try {
        const options = {
            ...baseOptions,
            url: `https://m.weibo.cn/detail/${id}`,
        }
        const xhr = await axios(options)
        const body = xhr.data
        const jsData = body.split('$render_data = [{')[1].split('}][0]')[0]
        const json = JSON.parse(`[{${jsData}}]`)
        const data = json[0].status
        const $return = {
            code: 200,
            ok: 1,
            data: {
                itemid: id,
                text: data.text.replace(/"\/\//g, '"https://'),
                pics: data.pics.map(item => item.large.url),
            },
        }
        res.json($return)
    }
    catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}
