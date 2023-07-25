const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const jwtConfig = require("../../config/jwt")

// 获取单个用户信息
router.get("/detail", (req, res) => {
    let id = req.query.id
    let detailSql = "SELECT * FROM user WHERE id = ? "
    db.query(detailSql, [id], (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: '获取用户失败'
            })
        } else if (results.length == 0) {
            res.send({
                code: 500,
                msg: '用户不存在'
            })
        } else {
            res.send({
                code: 200,
                msg: '获取用户成功',
                results: { ...results[0], password: '' }
            })
        }
    })
})

// 获取全部用户信息
router.get("/list", (req, res) => {
    /**
     * nickname 昵称
     * id 用户id
     * page 页码
     * pageSize 每页条数
     */

    let { nickname, id, page, pageSize } = req.query

    // GET 方式接收为字符串 数字需要转换为Int 否则数据库查询出错
    // 默认为1页
    page = parseInt(page == null ? 1 : page)
    // 默认为10条
    pageSize = parseInt(pageSize == null ? 10 : pageSize)

    // 默认为0
    id = parseInt(id == "" ? 0 : id)
    // 默认为空字符串
    nickname = (nickname == "" ? "" : nickname)

    let params = []
    let whereSql = []

    // 判断用户ID
    if (id !== 0) {
        whereSql.push(' `id` LIKE ? ')
        params.push('%' + id + '%')
    }

    // 判断关键字
    if (nickname !== '') {
        whereSql.push(' `nickname` LIKE ? ')
        params.push('%' + nickname + '%')
    }

    // 拼接where语句
    let whereSql2 = ''
    if (whereSql.length > 0) {
        whereSql2 = ' WHERE ' + whereSql.join(' AND ')
    }

    // 传入分页参数
    let searchSql = "SELECT id, username, nickname, email, create_time FROM `user` " + whereSql2 + " ORDER BY `id` DESC LIMIT ?, ?"
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    let countSql = "SELECT count(*) AS `count` FROM user " + whereSql2
    let countSqlParams = params

    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {
        if (err) {
            console.log(err);
            res.send({
                code: 500,
                msg: '查询用户失败'
            })
        } else {
            res.send({
                code: 200,
                msg: '查询用户成功',
                data: {
                    page,
                    pageSize,
                    rows: results[0],
                    count: results[1][0].count
                }
            })
        }
    })

})

// 修改用户信息
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

// 删除用户
router.delete("/delete", (req, res) => {
    let id = req.query.id

    // 应该级联删除所有关联的数据
    // 或者设置为软删除 is_delete = 1

    const deleteSql = "DELETE FROM user WHERE id = ?"
    db.query(deleteSql, [id], (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: '删除用户失败'
            })
        } else {
            res.send({
                code: 200,
                msg: '删除用户成功'
            })
        }
    })
})
module.exports = router