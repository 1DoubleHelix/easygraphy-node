const express = require('express')
const fs = require("fs");
const router = express.Router()

router.post("/upload", (req, res) => {
    console.log("上传头像");
    console.log(req.files);
    // 检查文件是否为空
    if (!req.files) {
        res.send({
            code: 400,
            msg: "上传文件为空",
        })
    } else {
        // 修改为用户ID
        let fileName = req.user.id + ".jpg"
        // 修改名字 移动文件
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + req.files[0].filename,
            process.cwd() + "/public/images/avatar/" + fileName
        )

        res.send({
            code: 200,
            msg: '上传头像成功',
            data: "/images/avatar/" + fileName,
        })
    }
})

module.exports = router;