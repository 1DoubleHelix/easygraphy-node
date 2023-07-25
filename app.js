// 导入 Express
const express = require('express')
// 创建实例
const app = express()
app.use(express.json())

// CORS
const cors = require('cors')
//开放跨域请求
const corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));

// 文件上传下载
const multer = require('multer')
const path = require("path");
// 处理临时上传
const upload = multer({
    dest: "./public/upload/temp"
})
// 允许所有接口上传
app.use(upload.any());
//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")))

// 解析 token 中间件
const jwtConfig = require("./config/jwt")
const expressJWT = require('express-jwt')
// api开头的接口不需要进行token认证
// 解析出来的信息挂载到 req.user 上
app.use(expressJWT({ secret: jwtConfig.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 测试路由
app.use('/test', require("./routes/apiAuth/testRouter"))

// 无需认证的接口
app.use('/api/user', require('./routes/api/user'))
app.use('/api/admin', require('./routes/api/admin'))
app.use('/api/tag', require('./routes/api/tag'))
app.use('/api/blog', require('./routes/api/blog'))
app.use('/api/camera', require('./routes/api/camera'))
app.use('/api/lens', require('./routes/api/lens'))
app.use('/api/comment', require('./routes/api/comment'))
app.use('/api/combine', require('./routes/api/combine'))
// app.use('/api/favorite', require('./routes/favorite'))
app.use('/api/helper', require('./routes/apiAuth/helper'))

// 需要认证的接口
app.use('/admin', require('./routes/apiAuth/admin'))
app.use('/tag', require('./routes/apiAuth/tag'))
app.use('/blog', require('./routes/apiAuth/blog'))
app.use('/upload', require('./routes/upload/richEditor'))
app.use('/api/camera', require('./routes/apiAuth/camera'))
app.use('/api/lens', require('./routes/apiAuth/lens'))
app.use('/comment', require('./routes/apiAuth/comment'))
app.use('/combine', require('./routes/apiAuth/combine'))
app.use('/favorite', require('./routes/apiAuth/favorite'))
app.use('/upload', require('./routes/upload/avatar'))
app.use('/api/user', require('./routes/apiAuth/user'))
// app.use('/helper', require('./routes/helper'))

// 错误中间件
app.use(function (err, req, res, next) {
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') {
        res.send({
            code: 401,
            msg: "无效token"
        })
        return
    }

    res.send({
        code: 500,
        msg: "服务器错误"
    })
    console.log(err)
})

app.listen(8088, () => {
    console.log('启动成功 -> localhost:8088');
})