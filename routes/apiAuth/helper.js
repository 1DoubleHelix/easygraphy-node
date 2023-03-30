const express = require('express')
const router = express.Router()
const db = require('../../config/db');
const genid = require('../../config/genid');

// 筛选相机
router.get('/camera', (req, res) => {
    let { mount, frame, budget } = req.query
    let selectSql = ' SELECT * FROM camera WHERE mount = ? AND frame = ? '

    // 如果选择预算不高 去除旗舰级相机
    if (budget == '3') {
        selectSql += ' AND price > 10349 '
    } else {
        selectSql += ' AND price < 25999 '
    }


    db.query(selectSql, [mount, frame], (err, data) => {
        if (err) {
            console.log(err);
            res.send({
                code: 500,
                msg: '查询相机失败'
            })
        } else {
            let camera = data
            res.send({
                code: 200,
                msg: '查询相机成功',
                data: camera
            })
        }
    })
})

// 筛选镜头
router.get('/lens', (req, res) => {
    let { mount, frame, style, budget } = req.query
    let selectSql = " SELECT * FROM lens WHERE mount REGEXP '[[:<:]]" + mount + "[[:>:]]' "

    // 全画幅相机只输出全画幅镜头
    if (frame == 'FX') {
        selectSql += " AND frame = 'FX' "
    }

    // 如果选择预算不高 去除高价镜头
    if (budget == '3') {
        selectSql += ' AND price > 1700 '
    } else {
        selectSql += ' AND price < 20000 '
    }

    // 获取数据 在回调函数中用JavaScript处理
    db.query(selectSql, (err, data) => {
        if (err) {
            console.log(err);
            res.send({
                code: 500,
                msg: '查询镜头失败'
            })
        } else {
            // 处理数据 按摄影风格筛选
            let lens = data
            if (style == 'daily') {
                // 取出定焦镜头数据
                let prime = lens.filter(item => item.zoom == 0)
                // 取出变焦镜头数据
                let zoom = lens.filter(item => item.zoom == 1)

                // 筛选定焦镜头
                if (frame == 'FX') {
                    // 24-58mm
                    prime = prime.filter(item => item.min_focal >= 24 && item.min_focal <= 58)
                } else if (frame == 'DX') {
                    // 24-50mm
                    prime = prime.filter(item => item.min_focal >= 24 && item.min_focal <= 50)
                }

                // 筛选变焦镜头
                if (frame == 'FX') {
                    // 24-200mm
                    zoom = zoom.filter(item => item.min_focal >= 24 && item.max_focal <= 200)
                } else if (frame == 'DX') {
                    // 18-105mm
                    zoom = zoom.filter(item => item.min_focal >= 18 && item.max_focal <= 105)
                }

                res.send({
                    code: 200,
                    msg: '查询镜头成功',
                    data: { prime, zoom }
                })

            } else if (style == 'portrait') {
                // 定焦镜头数据
                let prime = lens.filter(item => item.zoom == 0)
                // 标准变焦镜头数据
                let zoom = lens.filter(item => item.zoom == 1)
                // 长焦变焦镜头数据
                let teleZoom = zoom

                // 筛选定焦镜头
                if (frame == 'FX') {
                    // 35-135mm F<1.8
                    prime = prime.filter(item => item.min_focal >= 35 && item.min_focal <= 135 && item.max_aperture <= 1.8)
                } else if (frame == 'DX') {
                    // 24-85mm F<1.8
                    prime = prime.filter(item => item.min_focal >= 24 && item.min_focal <= 85 && item.max_aperture <= 1.8)
                }
                // 筛选标准变焦
                if (frame == 'FX') {
                    // 24-105mm F<4.5
                    zoom = zoom.filter(item => item.min_focal >= 24 && item.max_focal <= 105 && item.max_aperture <= 4.5)
                } else if (frame == 'DX') {
                    // 15-70mm F<4.5
                    zoom = zoom.filter(item => item.min_focal >= 15 && item.max_focal <= 70 && item.max_aperture <= 4.5)
                }
                // 筛选长焦变焦
                if (frame == 'FX') {
                    // max == 105-210mm F<4
                    teleZoom = teleZoom.filter(item => item.max_focal >= 105 && item.max_focal <= 210 && item.max_aperture <= 4)
                } else if (frame == 'DX') {
                    // max == 70-150 F<4
                    teleZoom = teleZoom.filter(item => item.max_focal >= 70 && item.max_focal <= 150 && item.max_aperture <= 4)
                }

                res.send({
                    code: 200,
                    msg: '查询镜头成功',
                    data: { prime, zoom, teleZoom }
                })

            } else if (style == 'landscape') {
                // 广角定焦
                let widePrime = lens.filter(item => item.zoom == 0)
                // 广角变焦
                let wideZoom = lens.filter(item => item.zoom == 1)
                // 长焦变焦
                let teleZoom = wideZoom

                // 筛选广角定焦
                if (frame == 'FX') {
                    // 14-28mm
                    widePrime = widePrime.filter(item => item.min_focal >= 14 && item.min_focal <= 28)
                } else if (frame == 'DX') {
                    // 10-24mm
                    widePrime = widePrime.filter(item => item.min_focal >= 10 && item.min_focal <= 24)
                }
                // 筛选广角变焦
                if (frame == 'FX') {
                    // min<24mm max<35mm
                    wideZoom = wideZoom.filter(item => item.min_focal <= 24 && item.max_focal <= 35)
                } else if (frame == 'DX') {
                    // min<=18mm max<24mm
                    wideZoom = wideZoom.filter(item => item.min_focal <= 18 && item.max_focal <= 24)
                }
                // 筛选长焦变焦
                if (frame == 'FX') {
                    // min>70mm max>200mm
                    teleZoom = teleZoom.filter(item => item.min_focal >= 70 && item.max_focal >= 200)
                } else if (frame == 'DX') {
                    // min>50mm max>150mm
                    teleZoom = teleZoom.filter(item => item.min_focal >= 50 && item.max_focal >= 150)
                }

                res.send({
                    code: 200,
                    msg: '查询镜头成功',
                    data: { widePrime, wideZoom, teleZoom }
                })

            }
        }
    })
})

module.exports = router