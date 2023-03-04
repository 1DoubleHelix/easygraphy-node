// 导入
const mysql = require('mysql')

// 建立数据库连接
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'easygraphy',
    multipleStatements: true //支持多条 sql 语句
})

module.exports = db