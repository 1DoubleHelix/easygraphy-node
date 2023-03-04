const express = require('express')
const router = express.Router()
const db = require('../config/db');
const genid = require('../config/genid');

// 添加相机
router.post("/add", (req, res) => {
    let {name, brand, mount, frame, score, mega_pixel, price, release_year, img_path} = req.body
    let id = genid.NextId()
    let params = {id, name, brand, mount, frame, score, mega_pixel, price, release_year, img_path}

    const insertSql = "INSERT INTO camera SET ?"
    db.query(insertSql, params, (err, results) => {
        // 报错
        if (err) {
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
    let {id, name, brand, mount, frame, score, mega_pixel, price, release_year, img_path} = req.body
    let params = {name, brand, mount, frame, score, mega_pixel, price, release_year, img_path}

    const updateSql = "UPDATE `camera` SET ? WHERE `id` = " + id
    db.query(updateSql, params, (err, results) => {
        // 报错
        if (err) {
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

// 查询相机
router.get("/search", (req, res) => {
    let {keyword} = req.query

    let params = "%" + keyword + "%"
    const searchSql = " SELECT * FROM camera WHERE `name` LIKE ? "
    db.query(searchSql, params, (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '搜索相机失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '搜索文章成功',
                keyword,
                results
            })
        }
    })
})

module.exports = router
