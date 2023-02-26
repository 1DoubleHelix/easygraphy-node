const express = require('express')
const router = express.Router()
const db = require('../db/db');
const genid = require('../db/genid');

// 全部tag列表
router.get('/list', (req, res) => {

    // 查询全部tag
    const search_sql = 'SELECT * FROM tag'
    db.query(search_sql, [], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '查询tag失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '查询tag成功',
                results
            })
        }
    })
})

// 删除tag
router.delete('/delete', (req, res) => {

    // 查询tag是否已存在（待实现）

    // 删除tag 使用 /tag/delete?id=xxx
    let id = req.query.id
    const delete_sql = 'DELETE FROM tag WHERE `id` = ?'
    db.query(delete_sql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '删除tag失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '删除tag成功'
            })
        }
    })
})

// 修改tag
router.put('/update', (req, res) => {

    // 查询tag是否已存在 （待实现）

    // 修改tag
    let {id, name} = req.body
    const update_sql = 'UPDATE `tag` SET `name` = ? WHERE `id` = ?'
    db.query(update_sql, [name, id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '修改tag失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '修改tag成功'
            })
        }
    })
})

// 添加tag
router.post('/add', (req, res) => {

    // 查询tag是否已存在 （待实现）

    // 新增tag
    let {name} = req.body
    const insert_sql = 'INSERT INTO `tag` (`id`, `name`) VALUES (?, ?)'
    db.query(insert_sql, [genid.NextId(), name], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '添加tag失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '添加tag成功'
            })
        }
    })
})


module.exports = router