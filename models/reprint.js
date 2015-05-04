/**
 * Created by yiwei on 2015/4/17.
 * @desc 定义关注模块
 */
var db = require('./db'),
    User = require('../models/user'),
    Post = require('../models/post').Post;

/**
 * @desc 转发象
 */
function Reprint(name, reprint) {
    this.name = name;
    this.reprint = reprint;
}

module.exports = Reprint;

/**
 * @desc 关注
 */
Reprint.prototype.save = function (callback) {
    var name = this.name,
        reprint = this.reprint;

    Post.update({
        "name":reprint.name,
        "time.day": reprint.day,
        "title": reprint.title
    }, {
        $inc: {'reprint': 1}
    }, function (err) {
        if (err) {
            return callback(err);
        } else {
            User.UserModel.update({
                "name": name
            }, {
                $push: {
                    "reprint": reprint
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
Reprint.prototype.remove = function (callback) {
    var name = this.name,
        reprint = this.reprint;

    Post.update({
        "name":reprint.name,
        "time.day": reprint.day,
        "title": reprint.title
    }, {
        $inc: {'reprint': -1}
    }, function (err) {
        if (err) {
            return callback(err);
        } else {
            User.UserModel.findOne({name: name}, function (err, result) {
                if (err) {
                    return callback(err);
                } else {
                    var _reprint = result.care;
                    _reprint = _reprint.filter(function (item, index) {
                        if (reprint.name != item.name || reprint.day != item.day || reprint.title != item.title) {
                            return item;
                        }
                    });
                    User.UserModel.findOneAndUpdate({
                        "name": name
                    }, {
                        $set: {
                            "reprint": _reprint
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
