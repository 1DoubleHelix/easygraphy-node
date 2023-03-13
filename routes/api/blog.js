const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 获取单篇文章
router.get("/detail", (req, res) => {
    let { id } = req.query
    let detailSql = "SELECT * FROM blog WHERE id = ? "
    db.query(detailSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '获取文章失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '获取文章成功',
                results: results[0]
            })
        }
    })
})

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
     * tagId 编号
     * page 页码
     * pageSize 分页大小
     * userID 用户ID
     * */

    // 拿到前端数据先做判断
    let { keyword, tagId, page, pageSize, userID } = req.query

    // GET 方式接收为字符串 数字需要转换为Int 否则数据库查询出错

    // 默认为1页
    page = parseInt(page == null ? 1 : page)
    // 默认为10条
    pageSize = parseInt(pageSize == null ? 10 : pageSize)
    // 默认为0
    tagId = parseInt(tagId == null ? 0 : tagId)
    // 默认为空字符串
    keyword = (keyword == null ? '' : keyword)

    let params = []
    let whereSql = []

    // 判断标签
    if (tagId !== 0) {
        whereSql.push(' `tag_id` = ? ')
        params.push(tagId)
    }

    // 判断用户ID
    if (userID != 0) {
        whereSql.push(' `user_id` = ? ')
        params.push(userID)
    }

    // 判断标题
    if (keyword !== '') {
        whereSql.push(' (`title` LIKE ? OR `content` LIKE ?) ')
        params.push('%' + keyword + '%')
        params.push('%' + keyword + '%')
    }

    // 拼接 where语句
    let whereSql2 = ''
    if (whereSql.length > 0) {
        // 如果 whereSql 有值 拼接时在每个语句中间加 AND
        whereSql2 = 'WHERE' + whereSql.join(' AND ')
    }

    // 拼接 Sql 查询分页
    // let searchSql = ' SELECT * FROM `blog` ' + whereSql2 + ' ORDER BY `create_time` DESC LIMIT ?, ? '
    // 超长内容裁剪 取前50个字符
    let searchSql = ' SELECT id, tag_id, title, LEFT(content,50) AS content, create_time FROM `blog` ' + whereSql2 + ' ORDER BY `create_time` DESC LIMIT ?, ? '
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // 拼接 Sql 查询数据总数
    // let countSql = ' SELECT count(*) FROM `blog` ' + whereSql2
    let countSql = ' SELECT count(*) AS `count` FROM `blog` ' + whereSql2
    let countSqlParams = params

    // 查询分页数据 多条 Sql 语句实现两次查询
    // let searchResult = db.query(searchSql, searchSqlParams)
    // let countResult = db.query(countSql, countSqlParams)
    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {

        // console.log(searchSqlParams.concat(countSqlParams));
        // console.log(err);

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
                    count: results[1][0].count
                }
            })
        }
    })
})

module.exports = router