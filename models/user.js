/**
 * Created by yiwei on 2015/4/10.
 * @desc 定义用户模块
 */

var db = require('./db'),
    Schema = db.Schema,
    /**
     * @desc Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection
     *       这里相当于MySQL中的建表
     */
    userSchema = new Schema({
        name: {type: String, unique: true},
        password: String,
        head: String,
        motto: String,
        sex: String,
        address: String,
        QQ: String,
        work: String,
        care: [], //关注
        reprint: [] //转发
    }),
    UserModel = db.model('User', userSchema);

function User(user) {
    this.name = user.name;
    this.password = user.password;
}

/**
 * @desc 导出模块
 */
module.exports = {
    User: User,
    UserModel: UserModel
};

/**
 * @desc 保存用户数据方法
 * @param callback 回调函数
 */
User.prototype.save = function (callback) {
    var user = {
        name: this.name,
        password: this.password,
        head: '',
        motto: '',
        sex: '',
        address: '',
        QQ: '',
        work: '',
        care: [],
        reprint: []
    };

    /**
     * @desc 向数据库注入数据
     */
    UserModel(user).save(function (err) {
        if (err) {
            return callback(err);
        } else {
            callback(null, user);
        }
    });
};

/**
 * @desc 通过用户名查找用户
 * @param name 用户名
 * @param callback
 */
User.findByName = function (name, callback) {
    UserModel.findOne({name: name}, function (err, result) {
        if (err) {
            return callback(err);
        } else {
            callback(null, result);
        }
    });
};

/**
 * @desc 修改用户个人信息
 * @param user
 * @param callback
 */
User.modify = function (user, callback) {
    UserModel.findOneAndUpdate({
        "name": user.name
    }, {
        $set: {
            sex: user.sex,
            motto: user.motto,
            address: user.address,
            QQ: user.QQ,
            work: user.work
        }
    }, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

/**
 * @desc 更新头像
 */
User.updateIcon = function (name, icon, callback) {
    UserModel.findOneAndUpdate({
        "name": name
    }, {
        $set: {
            head: icon
        }
    }, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

/**
 * @desc 统计每个user的关注总数
 * @param name
 * @param callback
 */
User.countCareByUser = function (name, callback) {
    UserModel.findOne({
        "name": name
    }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};


/**
 * @desc 拦截器,判断用户是否登录
 * @param user
 * @param req
 * @param res
 * @param next
 */
User.isLogin = function (user, req, res, next) {
    if (!!user) {

    } else {

    }
};