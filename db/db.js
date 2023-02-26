// 导入
const mysql = require('mysql')
// 雪花ID
const GenId = require('../utils/SnowFlake')

// 建立连接
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'easygraphy',
    multipleStatements: true //支持多条 sql 语句
})

const genid = new GenId({workerId: 1})

module.exports = dbUtils