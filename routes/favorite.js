const express = require('express')
const router = express.Router()
const db = require('../config/db');
const genid = require('../config/genid');

// 获取个人收藏夹 按分类
router.get("/list", (req, res) => {
    /**
     * page 页码
     * pageSize 分页大小
     * kind 收藏对象
     */
    let { page, pageSize, kind } = req.query
    // 通过token拿到用户id
    let userId = req.user.id


    // 默认为1页
    page = parseInt(page == null ? 1 : page)
    // 默认为10条
    pageSize = parseInt(pageSize == null ? 10 : pageSize)
    // 默认为0
    userId = parseInt(userId == null ? 0 : userId)

    let params = []
    let selectSql = []


    if (userId !== 0 && kind !== '') {
        params.push(userId)
        // 判断评论对象
        switch (kind) {
            case "blog":
                selectSql.push(' SELECT favorite.id, favorite.blog_id, blog.title FROM favorite JOIN blog ON favorite.blog_id = blog.id WHERE favorite.user_id = ? AND favorite.blog_id ')
                break;
            case "combine":
                selectSql.push(' SELECT favorite.id, favorite.combine_id, combine.title FROM favorite JOIN combine ON favorite.combine_id = combine.id WHERE favorite.user_id = ? AND favorite.combine_id ')
                break;
            case "camera":
                selectSql.push(' SELECT favorite.id, favorite.camera_id, camera.`name` FROM favorite JOIN camera ON favorite.camera_id = camera.id WHERE favorite.user_id = ? AND favorite.camera_id ')
                break;
            case "lens":
                selectSql.push(' SELECT favorite.id, favorite.lens_id, lens.brand, lens.`name` FROM favorite JOIN lens ON favorite.lens_id = lens.id WHERE favorite.user_id = ? AND favorite.lens_id ')
                break;
        }
    }

    // 查询特定分页
    let searchSql = selectSql + " ORDER BY `id` DESC LIMIT ?, ? "
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // 查询分页总数
    let countSql = 'SELECT count(*) AS `count` FROM `favorite` WHERE user_id = ? AND ' + kind + '_id'
    let countSqlParams = params

    console.log(searchSql + ';' + countSql);
    console.log(searchSqlParams + ';' + countSqlParams);

    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {
        // 错误
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: '获取收藏失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '获取收藏成功',
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

// 添加收藏
router.post("/add", (req, res) => {
    /**
     * kind 收藏对象
     * objectId 对象ID
     */

    let { kind, objectId } = req.body
    let id = genid.NextId()

    // 从token解析用户id
    let userId = req.user.id

    let params = [id, userId]
    let kindSql = []

    if (objectId !== 0 && kind !== '') {
        params.push(objectId)
        // 判断收藏对象
        switch (kind) {
            case "blog":
                kindSql.push(' blog_id ')
                break;
            case "combine":
                kindSql.push(' combine_id ')
                break;
            case "camera":
                kindSql.push(' camera_id ')
                break;
            case "lens":
                kindSql.push(' lens_id ')
                break;
        }
    }

    let insertSql = ' INSERT INTO `favorite` (`id`, `user_id`, ' + kindSql + ' ) VALUES (?, ?, ?) '

    db.query(insertSql, params, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: '收藏失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '收藏成功'
            })
        }
    })
})

// 取消收藏
router.delete("/delete", (req, res) => {
    let id = req.query.id

    const deleteSql = ' DELETE FROM `favorite` WHERE id = ? '

    db.query(deleteSql, [id], (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: '取消收藏失败'
            })
        } else {
            res.send({
                code: 200,
                msg: '取消收藏成功'
            })
        }
    })
})


module.exports = router