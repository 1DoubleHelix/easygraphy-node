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
// 指定哪些接口不需要进行 Token 的身份认证
// 解析出来的信息挂载到 req.user 上
// app.use(expressJWT({secret: jwtConfig.jwtSecretKey}).unless({path: [/^\/api\//]}))


// 测试路由
app.use('/test', require("./routes/testRouter"))
// 以下是所有路由
app.use('/admin', require('./routes/admin'))
app.use('/tag', require('./routes/tag'))
app.use('/blog', require('./routes/blog'))
app.use('/upload', require('./routes/upload/richEditor'))
app.use('/camera', require('./routes/camera'))
app.use('/lens', require('./routes/lens'))
app.use('/user', require('./routes/user'))


// 错误中间件
app.use(function (err, req, res, next) {
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') {
        res.send({
            code: 401,
            msg: "无效token"
        })
    }

    res.send({
        code: 500,
        msg: "服务器发生错误"
    })
})


app.get("/", (req, res) => {
    res.send("你好我是exp")
})


app.listen(8088, () => {
    console.log('启动成功 -> localhost:8088');
})