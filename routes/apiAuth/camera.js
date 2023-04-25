const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 添加相机
router.post("/add", (req, res) => {
    let id = genid.NextId()
    let params = { ...{ id }, ...req.body }

    const insertSql = "INSERT INTO camera SET ?"
    db.query(insertSql, params, (err, results) => {
        // 报错
        if (err) {
            console.log(err);
            res.send({
                code: 500,
                msg: '添加相机失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '添加相机成功'
            })
        }
    })
})

// 修改相机
router.put("/update", (req, res) => {
    let { id } = req.body
    let params = req.body
    // 删除 id 属性保持和 SET ? 需要的对象顺序一致
    delete params.id

    const updateSql = "UPDATE `camera` SET ? WHERE `id` = " + id
    db.query(updateSql, params, (err, results) => {
        // 报错
        if (err) {
            console.log(err);
            res.send({
                code: 500,
                msg: '修改相机失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '修改相机成功'
            })
        }
    })
})

// 删除相机
router.delete("/delete", (req, res) => {
    // 查询相机是否存在

    // 删除
    let id = req.query.id
    const deleteSql = 'DELETE FROM camera WHERE `id` = ?'
    db.query(deleteSql, [id], (err, results) => {
        // 报错
        if (err) {
            console.log(err);
            res.send({
                code: 500,
                msg: '删除相机失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '删除相机成功'
            })
        }
    })
})

module.exports = router
