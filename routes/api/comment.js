const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 获取一些评论
router.get('/search', (req, res) => {
    /**
     * page 页码
     * pageSize 分页大小
     * id 评论对象的ID 有4种 需要额外参数判断
     * type 评论的对象
     */

    // 拿到前端数据先做判断
    let { page, pageSize, id, type } = req.query

    // 默认为1页
    page = parseInt(page == null ? 1 : page)
    // 默认为10条
    pageSize = parseInt(pageSize == null ? 10 : pageSize)
    // 默认为0
    id = parseInt(id == null ? 0 : id)

    let params = []
    let whereSql = []

    if (id !== 0 && type !== '') {
        params.push(id)
        // 判断评论对象
        switch (type) {
            case "blog":
                whereSql.push(' WHERE `blog_id` = ? ')
                break;
            case "combine":
                whereSql.push(' WHERE `combine_id` = ? ')
                break;
            case "camera":
                whereSql.push(' WHERE `camera_id` = ? ')
                break;
            case "lens":
                whereSql.push(' WHERE `lens_id` = ? ')
                break;
        }
    }

    // 查询特定分页
    let searchSql = ' SELECT * FROM `comment` ' + whereSql + ' ORDER BY `create_time` DESC LIMIT ?, ? '
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // 查询分页总数
    let countSql = 'SELECT count(*) AS `count` FROM `comment` ' + whereSql
    let countSqlParams = params

    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {
        // 错误
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: '查询评论失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '获取评论成功',
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

module.exports = router