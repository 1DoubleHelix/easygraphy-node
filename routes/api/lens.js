const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 获取单个镜头数据
router.get("/detail", (req, res) => {
    let { id } = req.query
    let selectSql = "SELECT * FROM lens WHERE id = ? "

    db.query(selectSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '获取镜头信息失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '获取镜头信息成功',
                results: results[0]
            })
        }
    })
})

// 查询镜头
router.get("/search", (req, res) => {
    /*
    * mount 卡口
    * frame 画幅
    * zoom 可变焦
    * maxAperture 光圈大于
    * minFocal maxFocal 焦距
    * minPrice maxPrice 价格
    * keyword 型号关键字
    * page 页码
    * pageSize 分页大小
    * */

    let { mount, frame, zoom, maxAperture, minFocal, maxFocal, minPrice, maxPrice, keyword, page, pageSize } = req.query

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
            frame,
            zoom,
            maxAperture,
            minFocal,
            maxFocal,
            minPrice,
            maxPrice,
            keyword
        }).filter(([key, value]) => value !== '' && value !== undefined)
    );

    if (Object.keys(paramsTempObj).length !== 0) {

        // 这里需要正则匹配 数据库中多卡口镜头的mount值是用空格隔开的
        if (paramsTempObj.mount) {
            whereSql.push(" mount REGEXP '[[:<:]]" + mount + "[[:>:]]' ")
        }
        if (paramsTempObj.frame) {
            whereSql.push(' frame = ? ')
            params.push(frame)
        }
        if (paramsTempObj.zoom) {
            whereSql.push(' zoom = ? ')
            params.push(zoom)
        }
        if (paramsTempObj.maxAperture) {
            whereSql.push(' max_aperture <= ? ')
            params.push(maxAperture)
        }

        // 焦距范围
        if (paramsTempObj.minFocal || paramsTempObj.maxFocal) {
            minFocal == '' ? 0 : minFocal
            maxFocal == '' ? 2000 : maxFocal

            whereSql.push(' min_focal >= ? AND max_focal <= ? ')
            params.push(minFocal, maxFocal)
        }

        // 价格区间
        if (paramsTempObj.minPrice || paramsTempObj.maxPrice) {
            minPrice == '' ? 0 : minPrice
            maxPrice == '' ? 200000 : maxPrice

            whereSql.push(' price BETWEEN ? AND ? ')
            params.push(minPrice, maxPrice)
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
    let searchSql = ' SELECT * FROM `lens` ' + whereSql2 + ' ORDER BY `id` DESC LIMIT ?, ? '
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    let countSql = ' SELECT count(*) AS `count` FROM  lens ' + whereSql2
    let countSqlParams = params

    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {

        // 报错
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: '查询镜头失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '查询镜头成功',
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
