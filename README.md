# mmf-blog-api-v2

在 src/config 文件夹下 创建 mpapp.js 文件
里面写入: (小程序登录用的)
```javascript
exports.apiId = ''
exports.secret = ''
```

在 src/config 文件夹下 创建 shihua.js 文件
里面写入: (百度识花用的)
接口申请地址: http://ai.baidu.com/tech/imagerecognition
```javascript
exports.APP_ID = ''
exports.API_KEY = ''
exports.SECRET_KEY = ''
```

install nodejs, MongoDB, And start the
```bash
# Install dependencies
yarn

# or
npm install

# Start the API server
yarn serve
```

Add admin
http://localhost:4000/backend

After the success of the administrator to add, will automatically generate the admin. Lock file locking, if you need to continue to add, please just delete the file
