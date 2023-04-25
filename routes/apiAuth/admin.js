const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');
const bcrypt = require('bcryptjs')

// 管理员修改普通用户信息
router.put("/update", (req, res) => {
    let { id, username, nickname, email, password } = req.body

    let setSql = ""
    let params = [username, nickname, email]

    // 判断密码是否为空 为空不修改
    if (password !== '') {
        // 加密
        password = bcrypt.hashSync(password, 10)
        setSql = ", `password` = ?"
        params.push(password)
    }

    params.push(id)
    let updateSql = " UPDATE `user` SET `username` = ?, `nickname` = ?, `email` = ? " + setSql + " WHERE `id` = ? "

    // 修改用户信息
    db.query(updateSql, params, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: '修改用户失败'
            })
        } else {
            res.send({
                code: 200,
                msg: '修改用户成功'
            })
        }
    })

})

module.exports = router