/**
 * Created by yiwei on 2015/4/10.
 */
var db = require('./db'),
    Post = require('../models/post').Post;

/**
 * @desc 留言对象
 */
function Comment(name, day, title, comment) {
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
}

module.exports = Comment;

/**
 * @desc 发表评论
 */
Comment.prototype.save = function (callback) {
    var name = this.name,
        day = this.day,
        title = this.title,
        comment = this.comment;
    /**
     * @desc 通过用户名、时间及标题查找文档,并把一条留言对象添加到该文当的comments数组里
     */
    Post.update({
        "name": name,
        /*"time.day": day,*/
        "title": title
    }, {
        $push: {
            "comments": comment
        }
    }, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

