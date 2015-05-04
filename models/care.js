/**
 * Created by yiwei on 2015/4/17.
 * @desc 定义关注模块
 */
var db = require('./db'),
    User = require('../models/user'),
    Post = require('../models/post').Post;

/**
 * @desc 关注对象
 */
function Care(name, care) {
    this.name = name;
    this.care = care;
}

module.exports = Care;

/**
 * @desc 关注
 */
Care.prototype.save = function (callback) {
    var name = this.name,
        care = this.care;

    Post.update({
        "name":care.name,
        "time.day": care.day,
        "title": care.title
    }, {
        $inc: {'care': 1}
    }, function (err) {
        if (err) {
            return callback(err);
        } else {
            User.UserModel.update({
                "name": name
            }, {
                $push: {
                    "care": care
                }
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        }
    });
};

/**
 * @desc 撤销关注
 */
Care.prototype.remove = function (callback) {
    var name = this.name,
        care = this.care;

    Post.update({
        "name":care.name,
        "time.day": care.day,
        "title": care.title
    }, {
        $inc: {'care': -1}
    }, function (err) {
        if (err) {
            return callback(err);
        } else {
            User.UserModel.findOne({name: name}, function (err, result) {
                if (err) {
                    return callback(err);
                } else {
                    var _care = result.care;
                    _care = _care.filter(function (item, index) {
                        if (care.name != item.name || care.day != item.day || care.title != item.title) {
                            return item;
                        }
                    });
                    User.UserModel.findOneAndUpdate({
                        "name": name
                    }, {
                        $set: {
                            "care": _care
                        }
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null);
                    });
                }
            });
        }
    });
};