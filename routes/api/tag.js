const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 全部tag列表
router.get('/list', (req, res) => {

    // 查询全部tag
    const searchSql = 'SELECT * FROM tag'
    db.query(searchSql, [], (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '查询tag失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '查询tag成功',
                results
            })
        }
    })
})

module.exports = router