const express = require('express')
const router = express.Router()
const db = require('../db/db');
const genid = require('../db/genid');

router.get("/test", (req, res) => {
    // 测试数据库
    // db.query('SELECT 1', (err, results) => {
    //     // 报错
    //     if (err) return console.log(err.message);
    //     // 成功
    //     console.log(results);
    // })

    // 插入
    // db.query('UPDATE `admin` SET `token` = 12333333 WHERE `id` = 2', (err, results) => {
    //     console.log(results);
    // })

    // 查询
    db.query('SELECT * FROM admin WHERE account = ? AND PASSWORD = ?', ['admin', 'admin'], (err, results) => {
        console.log(results[0]);
        console.log('以下是外部接收的返回');
    })

    res.send({
        id: genid.NextId()
    })
})

module.exports = router