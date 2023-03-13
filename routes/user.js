const express = require('express')
const router = express.Router()
const db = require('../config/db');
const genid = require('../config/genid');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const jwtConfig = require("../config/jwt")

// 查询单个用户信息

module.exports = router