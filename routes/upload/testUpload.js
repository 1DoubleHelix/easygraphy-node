const express = require('express')
const fs = require("fs");
const router = express.Router

router.post("/upload", (req, res) => {
    // 检查文件是否为空
    if (!req.file) {
        res.send({
            code: 400,
            msg: "上传文件为空",
        })
    }

    // 保存文件
    let files = req.file;
    let ret_files = [];
    for (let file of files) {
        // 获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        // 使用时间戳
        let file_name = new Date().getTime() + "." + file_ext

        //修改名字加移动文件
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name
        )
        ret_files.push("/upload/" + file_name)
    }

    res.send({
        code: 200,
        msg: 'ok',
        data: ret_files,
    })

})

module.exports = router;
