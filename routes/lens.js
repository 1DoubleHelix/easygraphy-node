const express = require('express')
const router = express.Router()
const db = require('../config/db');
const genid = require('../config/genid');

// 添加镜头
router.post("/add", (req, res) => {
    let { name, brand, mount, frame, score, price, release_year, min_focal, max_focal, max_aperture, img_path } = req.body
    let id = genid.NextId()
    let params = {
        id,
        name,
        brand,
        mount,
        frame,
        score,
        price,
        release_year,
        min_focal,
        max_focal,
        max_aperture,
        img_path
    }

    const insertSql = "INSERT INTO lens SET ?"
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

// 修改镜头
router.put("/update", (req, res) => {
    let {
        id,
        name,
        brand,
        mount,
        frame,
        score,
        price,
        release_year,
        min_focal,
        max_focal,
        max_aperture,
        img_path
    } = req.body
    let params = {
        name,
        brand,
        mount,
        frame,
        score,
        price,
        release_year,
        min_focal,
        max_focal,
        max_aperture,
        img_path
    }

    const updateSql = "UPDATE `lens` SET ? WHERE `id` = " + id
    db.query(updateSql, params, (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '修改镜头失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '修改镜头成功'
            })
        }
    })
})

// 删除镜头
router.delete("/delete", (req, res) => {
    // 查询镜头是否存在

    let id = req.query.id
    const deleteSql = 'DELETE FROM lens WHERE `id` = ?'
    db.query(deleteSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '删除镜头失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '删除镜头成功'
            })
        }
    })
})

// 查询镜头
router.get("/search", (req, res) => {
    let { keyword } = req.query

    let params = "%" + keyword + "%"
    const searchSql = " SELECT * FROM lens WHERE `name` LIKE ? "
    db.query(searchSql, params, (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '搜索镜头失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '搜索镜头成功',
                keyword,
                results
            })
        }
    })
})

module.exports = router
