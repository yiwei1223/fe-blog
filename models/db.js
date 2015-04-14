/**
 * Created by yiwei on 2015/4/10.
 * @desc 链接数据库
 */
var config = require('../config'),
    mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://' + config.host + '/' + config.db);
