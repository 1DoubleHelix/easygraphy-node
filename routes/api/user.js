const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const jwtConfig = require("../../config/jwt")


// 注册
router.post("/register", (req, res) => {
    const userInfo = req.body
    if (!userInfo.username || !userInfo.password) {
        return res.send({
            code: 1,
            message: '用户名或密码不能为空'
        })
    }

    const selectSql = " SELECT * FROM `user` WHERE username = ? "
    db.query(selectSql, userInfo.username, (err, results) => {
        if (err) {
            res.send({
                code: 1,
                msg: 'Sql操作失败'
            })
            return;
        }
        if (results.length > 0) {
            res.send({
                code: 1,
                msg: '用户名已存在'
            })
            return;
        }

        // 加密密码 加盐
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        // 生成用户ID
        userInfo.id = genid.NextId()
        // 插入用户数据
        const insertSql = "INSERT INTO user SET ?"
        db.query(insertSql, userInfo, (err, results) => {
            if (err) {
                res.send({
                    code: 1,
                    msg: '注册失败'
                })
            }
            // 成功
            else {
                // console.log(results);
                res.send({
                    code: 200,
                    msg: '注册成功',
                })
            }
        })
    })
})

// 登录
router.post("/login", (req, res) => {
    const userInfo = req.body

    const params = userInfo.username
    const selectSql = "SELECT * FROM `user` WHERE username = ?"
    db.query(selectSql, params, (err, results) => {
        if (err || results.length !== 1) {
            console.log(err, "有同名用户")
            res.send({
                code: 500,
                msg: '用户查找失败'
            })
            return
        }

        // 验证密码
        const checkPassword = bcrypt.compareSync(userInfo.password, results[0].password)
        if (!checkPassword) {
            res.send({
                code: 1,
                msg: "密码错误"
            })
            return;
        }

        // 去除密码 生成token
        const user = { ...results[0], password: '' }
        const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey, { expiresIn: '10h' })

        res.send({
            code: 200,
            msg: "登录成功",
            id: results[0].id,
            username: results[0].username,
            nickname: results[0].nickname,
            email: results[0].email,
            token: 'Bearer ' + tokenStr,
        })

    })

})

module.exports = router