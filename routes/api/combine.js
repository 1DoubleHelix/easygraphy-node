const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 查询单个组合
/**
 * 返回的数据格式
 * combine:{id, user_id},
 * camera:{id,brand,name},
 * lensGroup:[
 *      {id,brand,name},
 *      {id,brand,name},
 *      {id,brand,name},
 * ] 
 */
router.get("/detail", (req, res) => {
    let { id } = req.query
    // 拼接好的数据
    let combineDetial = {
        combine: {},
        camera: {},
        lensGroup: []
    }

    // 在combine查询一行数据
    let selectCombineSql = " SELECT * FROM combine WHERE id = ? "
    db.query(selectCombineSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '获取组合失败'
            })
        } else {
            // 拼接数据
            combineDetial.combine = results[0]

            // 在camera中查询一行数据
            let selectCameraSql = " SELECT * FROM `camera` WHERE id = ? "
            db.query(selectCameraSql, [combineDetial.combine.camera_id], (err, results) => {
                if (err) {
                    res.send({
                        code: 500,
                        msg: '获取组合失败'
                    })
                } else {
                    // 拼接数据
                    combineDetial.camera = results[0]

                    // 在combine_lens中查询一组数据，再查询所有lens
                    let selectLensSql = " SELECT lens.* FROM combine_lens JOIN lens ON combine_lens.lens_id = lens.id WHERE combine_lens.combine_id = ? "
                    db.query(selectLensSql, [id], (err, results) => {
                        if (err) {
                            res.send({
                                code: 500,
                                msg: '获取组合失败'
                            })
                        } else {
                            // 拼接数据
                            combineDetial.lensGroup = results
                            res.send(combineDetial)
                        }
                    })
                }
            })
        }
    })
})

// 查询组合
router.get("/search", (req, res) => {
    /**
     * keyword 关键词
     * userID 用户ID
     * page 页码
     * pageSIze 分页大小
     */

    let { keyword, userID, page, pageSize } = req.query

    // 默认为1页
    page = parseInt(page == null ? 1 : page)
    // 默认为10条
    pageSize = parseInt(pageSize == null ? 10 : pageSize)
    // 默认为空字符串
    keyword = (keyword == null ? '' : keyword)
    // 默认为0
    userID = parseInt(userID == null ? 0 : userID)

    let params = []
    let whereSql = []

    // 判断标题
    if (keyword !== '') {
        whereSql.push(' (`title` LIKE ? OR `content` LIKE ?) ')
        params.push('%' + keyword + '%')
        params.push('%' + keyword + '%')
    }

    // 判断用户ID
    if (userID !== 0) {
        whereSql.push(' `user_id` = ? ')
        params.push(userID)
    }

    // 拼接 where语句
    let whereSql2 = ''
    if (whereSql.length > 0) {
        // 如果 whereSql 有值 拼接时在每个语句中间加 AND
        whereSql2 = 'WHERE' + whereSql.join(' AND ')
    }

    // 拼接 Sql 查询分页
    // 超长内容裁剪 取前50个字符
    let searchSql = ' SELECT c.*, m.brand, m.name, u.nickname FROM `combine` c JOIN camera m ON c.camera_id = m.id JOIN user u ON c.user_id = u.id ' + whereSql2 + ' ORDER BY `create_time` DESC LIMIT ?, ? '
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // 拼接 Sql 查询数据总数
    let countSql = ' SELECT count(*) AS `count` FROM `combine` ' + whereSql2
    let countSqlParams = params

    // 查询分页数据 多条 Sql 语句实现两次查询
    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: '查询组合失败'
            })
        } else {
            res.send({
                code: 200,
                msg: '查询组合成功',
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