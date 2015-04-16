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

/**
 * @desc 统计每个用户总共的评论数
 * @param name
 * @param callback
 */
Comment.countCommentsByUser = function (name, callback) {
    Post.count({
        "comments.fromWho": name
    }, function (err, count) {
        if (err)
            return callback(err);
        callback(null, count);
    });
};

/**
 * @desc 修改博客主的头像
 * @param name
 * @param icon
 * @param callback
 */
Comment.modifyIconByUserName = function (name, icon, callback) {
    Post.findOneAndUpdate({
        "comments.fromWho": name
    }, {
        $set: {
            "comments.head": icon
        }
    }, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
    /*Post.findOne({"comments.fromWho": name}, "comments", function (err, blog) {
        console.log(blog);
        var _comments = blog.comments.map(function (comment, index) {
         comment.head = icon;
         });
         Post.where({"comments.fromWho": name}).update({$set: {comments: _comments}}, function (err) {
         if (err) {
         return callback(err);
         }
         callback(null);
         });
    });*/
};
