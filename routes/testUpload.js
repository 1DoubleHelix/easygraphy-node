const express = require('express')
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
    let file = req.file;
    let ret_files = [];
    for(let file of files)


})

