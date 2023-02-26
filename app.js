// 导入 Express
const express = require('express')
// 创建实例
const app = express()
// CORS 解决跨域
const cors = require('cors')
// 文件上传下载
const multer = require('multer')
//开放跨域请求
app.use(cors())
app.use((req, res, next) => {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method === "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});
app.use(express.json())


// 处理临时上传
const upload = multer({
    dest: "/public/upload/temp"
})
// 允许所有接口上传
app.use(upload.any());


// 以下是所有路由

// 测试路由
app.use('/test', require("./routes/testRouter"))
app.use('/admin', require('./routes/admin'))
app.use('/tag', require('./routes/tag'))
app.use('/blog', require('./routes/blog'))


app.get("/", (req, res) => {
    res.send("你好我是exp")
})


app.listen(8088, () => {
    console.log('启动成功 -> localhost:8088');
})