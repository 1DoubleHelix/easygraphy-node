const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid')
const db = require('../db/db');

router.post('/login', (req, res) => {
    let {account, password} = req.body
    let out = db.query('SELECT * FROM admin WHERE account = ? AND PASSWORD = ?', [account, password], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '登录失败'
            })
        }
        // 成功
        else {

            // 使用uuid生成token 写回数据库
            let login_token = uuidv4();
            let update_token_sql = 'UPDATE `admin` SET `token` = ? WHERE `id` = ?'
            db.query(update_token_sql, [login_token, results[0].id])

            // admin 信息发给前端 无password 带token
            let admin_info = results[0]
            admin_info.token = login_token
            admin_info.password = ''

            res.send({
                code: 200,
                msg: '登录成功',
                data: admin_info,
            })
        }
    })
})

module.exports = router