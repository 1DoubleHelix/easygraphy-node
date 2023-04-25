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
    userID = parseInt(userID == null ? 0 : userID)
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
    if (userID !== 0) {
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
    // 超长内容裁剪 取前50个字符
    let searchSql = ' SELECT b.id, b.user_id, u.nickname, b.tag_id, b.title, LEFT(b.content,50) AS content, b.create_time FROM `blog` b JOIN user u ON b.user_id = u.id ' + whereSql2 + ' ORDER BY `create_time` DESC LIMIT ?, ? '
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // 拼接 Sql 查询数据总数
    let countSql = ' SELECT count(*) AS `count` FROM `blog` ' + whereSql2
    let countSqlParams = params

    // 查询分页数据 多条 Sql 语句实现两次查询
    db.query(searchSql + ';' + countSql, searchSqlParams.concat(countSqlParams), (err, results) => {

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