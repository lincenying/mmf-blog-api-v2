const { LRUCache } = require('lru-cache')

const meizituCache = new LRUCache({
    max: 1000,
    ttl: 1000 * 60 * 60 * 24 * 7,
})

exports.meizituCache = meizituCache

const douyinCache = new LRUCache({
    max: 1000,
    ttl: 1000 * 60 * 60 * 1,
})

exports.douyinCache = douyinCache
