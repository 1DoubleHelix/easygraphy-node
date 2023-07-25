const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

router.get("/test", (req, res) => {
    // 测试数据库
    db.query('SELECT 1', (err, results) => {
        // 报错
        if (err) return console.log(err.message);
        // 成功
        console.log(results);
    })

    // 查询
    // db.query('SELECT * FROM admin WHERE account = ? AND PASSWORD = ?', ['admin', 'admin'], (err, results) => {
    //     console.log(results[0]);
    //     console.log('以下是外部接收的返回');
    // })

    // tonken验证成功 会解析到req.user 可以区分每个用户的操作
    console.log(req.user);

    res.send({
        id: genid.NextId()
    })
})

module.exports = router