/**
 * Created by yiwei on 2015/4/9.
 */

/**
 * @desc 引入第三方模块以及内部模块
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    multer = require('multer'),
    path = require('path'),
    router = require('./routes');

/**
 * @desc 创建server
 */
var app = express();

/**
 * @desc 设置配置信息
 */
app.set('port', 3000);//端口
app.set('view engine', 'ejs');//模板引擎
app.set('views', path.join(__dirname, 'views'));//视图资源地址

/**
 * @desc 使用中间件
 */
app.use(express.static(path.join(__dirname, 'public')));//挂载静态资源
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({
    keys: ['user', 'blog']
}));

/**
 * @desc 使用路由
 */
router(app);

/**
 * @desc 监听服务
 */
app.listen(app.get('port'), function () {
    console.log('success listen port: ', app.get('port'));
});