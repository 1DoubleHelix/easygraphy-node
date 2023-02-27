const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid')
const db = require('../db/db');

router.post('/login', (req, res) => {
    let {account, password} = req.body
    db.query('SELECT * FROM admin WHERE account = ? AND PASSWORD = ?', [account, password], (err, results) => {
        // 报错
        if (!err && results.length === 0) {
            res.send({
                code: 500,
                msg: '登录失败'
            })
        }
        // 成功
        else {
            // 使用uuid生成token 写回数据库
            let loginToken = uuidv4();
            let updateTokenSql = 'UPDATE `admin` SET `token` = ? WHERE `id` = ?'
            db.query(updateTokenSql, [loginToken, results[0].id])

            // admin 信息发给前端 无password 带token
            let admin_info = results[0]
            admin_info.token = loginToken
            admin_info.password = ''

            res.send({
                code: 200,
                msg: '登录成功',
                data: admin_info,
            })
        }
    });
})

module.exports = router