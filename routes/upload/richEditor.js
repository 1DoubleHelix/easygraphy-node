const express = require('express')
const router = express.Router()
const fs = require('fs')
const genid = require('../../config/genid');

router.post("/images", (req, res) => {
    if (!req.files) {
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return;
    } else {
        let files = req.files
        let retFiles = []

        // 只取多个文件中的第一个
        for (let file of files) {
            // 获取文件后缀
            let fileExt = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
            // 生成随机文件名 拼接后缀
            let fileName = genid.NextId() + '.' + fileExt
            // 修改名字 移动文件
            fs.renameSync(process.cwd() + '/public/upload/temp/' + file.filename,
                process.cwd() + '/public/upload/' + fileName
            )
            retFiles.push('/upload/' + fileName)
        }

        // WangEditor 的 API
        res.send({
            "errno": 0, // 注意：值是数字，不能是字符串
            "data": {
                "url": retFiles[0], // 图片 src ，必须
                // "alt": "yyy", // 图片描述文字，非必须
                // "href": "zzz" // 图片的链接，非必须
            }
        })
    }
})

module.exports = router