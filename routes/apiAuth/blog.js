const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 添加博客
router.post('/add', (req, res) => {
    let { title, tagId, content } = req.body
    let id = genid.NextId()
    let createTime = new Date().getTime()
    let user_id = req.user.id


    let params = [id, user_id, tagId, title, content, createTime]
    const insertSql = 'INSERT INTO `blog` (`id`, `user_id`, `tag_id`, `title`, `content`, `create_time`) VALUES (?, ?, ?, ?, ?, ?);'
    db.query(insertSql, params, (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '添加文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '添加文章成功'
            })
        }
    })
})

// 修改博客
router.put('/update', (req, res) => {
    let { title, tagId, content, id } = req.body

    // 这里要检验token中的id 用户只能修改自己的文章 管理员除外

    let params = [tagId, title, content, id]
    const updateSql = 'UPDATE `blog` SET `tag_id` = ?, `title` = ?, `content` = ? WHERE `id` = ?;'
    db.query(updateSql, params, (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '修改文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '修改文章成功'
            })
        }
    })
})

// 删除博客
router.delete('/delete', (req, res) => {

    // 查询tag是否已存在（待实现）

    // 删除tag 使用 /blog/delete?id=xxx
    let id = req.query.id

    const deleteSql = 'DELETE FROM blog WHERE `id` = ?'
    db.query(deleteSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '删除文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '删除文章成功'
            })
        }
    })
})

module.exports = router