const express = require('express')
const router = express.Router()
const db = require('../db/db');
const genid = require('../db/genid');

// 全部tag列表
router.get('/list', (req, res) => {

    // 查询全部tag
    const searchSql = 'SELECT * FROM tag'
    db.query(searchSql, [], (err, results) => {
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
    const deleteSql = 'DELETE FROM tag WHERE `id` = ?'
    db.query(deleteSql, [id], (err, results) => {
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
    const updateSql = 'UPDATE `tag` SET `name` = ? WHERE `id` = ?'
    db.query(updateSql, [name, id], (err, results) => {
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
    const insertSql = 'INSERT INTO `tag` (`id`, `name`) VALUES (?, ?)'
    db.query(insertSql, [genid.NextId(), name], (err, results) => {
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