const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 添加组合
router.post("/add", (req, res) => {
    let id = genid.NextId()
    let { title, content, camera_id, lensGroup } = req.body

    // 从token获取user_id
    let user_id = req.user.id
    let create_time = new Date().getTime()

    // 组合表
    const insertCombineSql = ' INSERT INTO `combine` SET ? '
    let combineParams = [{ id, user_id, camera_id, title, content, create_time }]

    // 组合镜头表
    const insertCombineLensSql = ' INSERT INTO `combine_lens` (`combine_id`, `lens_id`) VALUES ? '
    let combineLensParams = [[]]
    // 准备参数数组 使用sql语句一次性插入
    for (let index in lensGroup) {
        combineLensParams[0].push([id, lensGroup[index]])
    }

    // 插入组合
    db.query(insertCombineSql + ";" + insertCombineLensSql, combineParams.concat(combineLensParams), (err, results) => {
        // 报错
        if (err) {
            res.send({
                code: 500,
                msg: '添加组合失败'
            })
            console.log(err);
            console.log(results);
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '添加组合成功'
            })
        }
    })


})

// 删除组合
router.delete("/delete", (req, res) => {
    let id = req.query.id
    const deleteCombineSql = 'DELETE FROM combine WHERE `id` = ?'
    const deleteCombineLensSql = 'DELETE FROM combine_lens WHERE `combine_id` = ?'

    db.query(deleteCombineSql + ";" + deleteCombineLensSql, [id, id], (err, results) => {
        // 报错
        if (err) {
            console.log(err);
            res.send({
                code: 500,
                msg: '删除组合失败'
            })
        }
        // 成功
        else {
            res.send({
                code: 200,
                msg: '删除组合成功'
            })
        }
    })
})

// 修改组合 ??? 太难辣

module.exports = router