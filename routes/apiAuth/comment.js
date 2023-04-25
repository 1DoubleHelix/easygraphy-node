const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 添加评论
router.post("/add", (req, res) => {
    /*
    用户id
    评论对象
    评论id
    内容
    生成时间
    生成评论id
     */
    let { type, objectId, content } = req.body
    let id = genid.NextId()
    // 从token解析用户id
    let userId = req.user.id
    let createTime = new Date().getTime()

    let params = [id, userId, createTime, content]
    let typeSql = []

    if (objectId !== 0 && type !== '') {
        params.push(objectId)
        // 判断评论对象
        switch (type) {
            case "blog":
                typeSql.push(' blog_id ')
                break;
            case "combine":
                typeSql.push(' combine_id ')
                break;
            case "camera":
                typeSql.push(' camera_id ')
                break;
            case "lens":
                typeSql.push(' lens_id ')
                break;
        }
    }

    let insertSql = 'INSERT INTO `comment` ( id, user_id, create_time, content, ' + typeSql + ' ) VALUES (?, ?, ?, ?, ?)'

    db.query(insertSql, params, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: '评论失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '评论成功'
            })
        }
    })


})

// 删除评论
router.delete("/delete", (req, res) => {
    let id = req.body.id

    const deleteSql = ' DELETE FROM `comment` WHERE id = ? '

    db.query(deleteSql, [id], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '删除评论失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '删除评论成功'
            })
        }
    })
})

module.exports = router