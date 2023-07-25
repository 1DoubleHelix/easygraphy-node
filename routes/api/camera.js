const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 获取单个相机数据
router.get("/detail", (req, res) => {
    let {id} = req.query
    let selectSql = "SELECT * FROM camera WHERE id = ? "

    db.query(selectSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '获取相机信息失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '获取相机信息成功',
                results: results[0]
            })
        }
    })
})

// 查询相机
router.get("/search", (req, res) => {
    /*
    * mount 卡口
    * type 是否有反光镜 1为单反
    * frame 画幅
    * releaseYear 发布年份
    * minPrice maxPrice 价格
    * minPixel maxPixel 像素
    * keyword 型号关键字
    * page 页码
    * pageSize 分页大小
    * */

    let {mount, type, frame, releaseYear, minPrice, maxPrice, minPixel, maxPixel, keyword, page, pageSize} = req.query

    // 默认为1页
    page = parseInt(page == null ? 1 : page)
    // 默认为10条
    pageSize = parseInt(pageSize == null ? 10 : pageSize)

    let params = []
    let whereSql = []

    // 判断是否有参数
    let paramsTempObj = Object.fromEntries(
        Object.entries({
            mount,
            type,
            frame,
            releaseYear,
            minPrice,
            maxPrice,
            minPixel,
            maxPixel,
            keyword
        }).filter(([key, value]) => value !== '' && value !== undefined)
    );

    if (Object.keys(paramsTempObj).length !== 0) {

        if (paramsTempObj.mount) {
            whereSql.push(' mount = ? ')
            params.push(mount)
        }
        if (paramsTempObj.type) {
            whereSql.push(' type = ? ')
            params.push(type)
        }
        if (paramsTempObj.frame) {
            whereSql.push(' frame = ? ')
            params.push(frame)
        }
        if (paramsTempObj.releaseYear) {
            whereSql.push(' release_year = ? ')
            params.push(releaseYear)
        }

        // 价格区间
        if (paramsTempObj.minPrice || paramsTempObj.maxPrice) {
            minPrice == '' ? 0 : minPrice
            maxPrice == '' ? 1000000 : maxPrice

            whereSql.push(' price BETWEEN ? AND ? ')
            params.push(minPrice, maxPrice)
        }

        // 像素区间
        if (paramsTempObj.minPixel || paramsTempObj.maxPixel) {
            minPixel == '' ? 0 : minPixel
            maxPixel == '' ? 100000 : maxPixel

            whereSql.push(' w_pixel BETWEEN ? AND ? ')
            params.push(minPixel, maxPixel)
        }

        if (paramsTempObj.keyword) {
            whereSql.push(' `name` LIKE ? ')
            params.push("%" + keyword + "%")
        }

    }

    // 拼接生成最终where语句
    let whereSql2 = ''
    if (whereSql.length > 0) {
        whereSql2 = ' WHERE ' + whereSql.join(' AND ')
    }

    // 传入分页参数
    let searchSql = ' SELECT * FROM `camera` ' + whereSql2 + ' ORDER BY `id` DESC LIMIT ?, ? '
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    let countSql = ' SELECT count(*) AS `count` FROM  camera ' + whereSql2
    let countSqlParams = params

    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {

        // 报错
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: '查询相机失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '查询相机成功',
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
