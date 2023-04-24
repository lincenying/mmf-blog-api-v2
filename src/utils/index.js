const fs = require('node:fs')

function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK)
    }
    catch (e) {
        return false
    }
    return true
}
exports.fsExistsSync = fsExistsSync

exports.strLen = (str) => {
    let charCode = -1
    let realLength = 0
    const len = str.length
    for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128)
            realLength += 1
        else realLength += 2
    }
    return realLength
}

exports.creatSecret = () => {
    if (!fsExistsSync('./src/config/secret.js')) {
        const secretServer1 = Math.random() * 1000000
        const secretClient1 = Math.random() * 1000000
        const secret1 = `exports.secretServer = '${secretServer1}'
exports.secretClient = '${secretClient1}'`
        fs.writeFileSync('./src/config/secret.js', secret1)
    }
}

exports.creatMpApp = () => {
    if (!fsExistsSync('./src/config/mpapp.js')) {
        const secret = `exports.apiId = ''
exports.secret = ''`
        fs.writeFileSync('./src/config/mpapp.js', secret)
    }
}

exports.creatShiHua = () => {
    if (!fsExistsSync('./src/config/shihua.js')) {
        const secret = `exports.APP_ID = ''
exports.API_KEY = ''
exports.SECRET_KEY = ''`
        fs.writeFileSync('./src/config/shihua.js', secret)
    }
}

exports.creatQiNiu = () => {
    if (!fsExistsSync('./src/config/qiniu.js')) {
        const secret = `exports.accessKey = ''
exports.secretKey = ''
exports.bucket = ''`
        fs.writeFileSync('./src/config/qiniu.js', secret)
    }
}

exports.creatTuJiDao = () => {
    if (!fsExistsSync('./src/config/tujidao.js')) {
        const secret = 'exports.cookies = \'\''
        fs.writeFileSync('./src/config/tujidao.js', secret)
    }
}
