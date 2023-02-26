const express = require('express')
const router = express.Router()
const db = require('../db/db');
const genid = require('../db/genid');

// 添加博客
router.post('/add', (req, res) => {
    let { title, tagId, content } = req.body
    let id = genid.NextId()
    let createTime = new Date().getTime()

    let params = [id, tagId, title, content, createTime]
    const insertSql = 'INSERT INTO `blog` (`id`, `tag_id`, `title`, `content`, `create_time`) VALUES (?, ?, ?, ?, ?);'
    db.query(insertSql, params, (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '添加文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '添加文章成功'
            })
        }
    })
})

// 修改博客
router.put('/update', (req, res) => {
    let { title, tagId, content, id } = req.body

    let params = [tagId, title, content, id]
    const updateSql = 'UPDATE `blog` SET `tag_id` = ?, `title` = ?, `content` = ? WHERE `id` = ?;'
    db.query(updateSql, params, (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '修改文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '修改文章成功'
            })
        }
    })
})

// 删除博客
router.delete('/delete', (req, res) => {

    // 查询tag是否已存在（待实现）

    // 删除tag 使用 /blog/delete?id=xxx
    let id = req.query.id

    const deleteSql = 'DELETE FROM blog WHERE `id` = ?'
    db.query(deleteSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '删除文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '删除文章成功'
            })
        }
    })
})

// 查询博客
router.get('/search', (req, res) => {
    /**
     * keyword 关键字
     * tag 编号
     * page 页码
     * pageSize 分页大小
     * */

    // 拿到前端数据先做判断
    let { keyword, tagId, page, pageSize } = req.query

    // GET 方式接收为字符串 需要转换为Int 否则数据库查询出错

    // 默认为1页
    page = parseInt(page == null ? 1 : page)
    // 默认为10条
    pageSize = parseInt(pageSize == null ? 10 : pageSize)
    // 默认为0
    tagId = parseInt(tagId == null ? 0 : tagId)
    // 默认为空字符串
    keyword = (keyword == null ? '' : keyword)


    // 判断标签
    let params = []
    let whereSql = []
    if (tagId !== 0) {
        whereSql.push(' `tag_id` = ? ')
        params.push(tagId)
    }

    // 判断标题
    if (keyword !== '') {
        whereSql.push(' `title` LIKE = ? OR `content` LIKE ? ')
        params.push('%' + keyword + '%')
        params.push('%' + keyword + '%')
    }

    // 拼接 where语句
    let whereSql2 = ''
    if (whereSql.length > 0) {
        // 如果 whereSql 有值 拼接时加 AND
        whereSql2 = 'WHERE' + whereSql.join(' AND ')
    }

    // 拼接 Sql 查询分页
    let searchSql = ' SELECT * FROM `blog` ' + whereSql2 + ' ORDER BY `create_time` DESC LIMIT ?, ? '
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // 拼接 Sql 查询数据总数
    // let searchCountSql = ' SELECT count(*) FROM `blog` ' + whereSql2
    let searchCountSql = ' SELECT count(*) AS `count` FROM `blog` ' + whereSql2
    let searchCountSqlParams = params

    // 查询分页数据 多条 Sql 语句实现两次查询
    // let searchResult = db.query(searchSql, searchSqlParams)
    // let countResult = db.query(searchCountSql, searchCountSqlParams)
    db.query(searchSql + ';' + searchCountSql, searchSqlParams.concat(searchCountSqlParams), (err, results) => {

        // console.log(searchSqlParams.concat(searchCountSqlParams));
        // console.log(results);

        // 报错
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: '查询文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '查询文章成功',
                data: {
                    keyword,
                    tagId,
                    page,
                    pageSize,
                    rows: results[0],
                    count: results[1]
                }
            })
        }
    })
})

module.exports = router