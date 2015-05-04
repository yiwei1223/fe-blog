/**
 * Created by yiwei on 2015/4/10.
 * @desc 定义博客模块
 */

var db = require('./db'),
    User = require('../models/user'),
    Schema = db.Schema,
    BlogSchema = new Schema({
        name: String,
        time: {
            data: Date,
            year: String,
            month: String,
            day: String,
            minute: String
        },
        head: String,
        title: String,
        tags: [],
        post: String,
        comments: [],
        reprint: Number, //转发
        pv: Number,
        care: Number//关注
    }),
    Post = db.model('Post', BlogSchema),
    tool = require('../tool/time');//调用工具类

function Blog(name, head, title, tags, post) {
    this.name = name;
    this.head = head;
    this.title = title;
    this.tags = tags;
    this.post = post;
}

/**
 * @desc 导出博客
 */
module.exports = {
    Blog: Blog,
    Post: Post
};

/**
 * @method publish
 * @param callback
 * @desc 发布Blog
 */
Blog.prototype.publish = function (callback) {
    var _post = {
        name: this.name,
        time: tool.time(new Date()),
        title: this.title,
        head: this.head,
        tags: this.tags,
        post: this.post,
        reprint_info: {
            reprint_from: {},
            reprint_to: []
        },
        comments: [],
        pv: 0,
        care: 0,
        reprint: 0
    };
    Post(_post).save(function (err) {
        if (err)
            return callback(err);
        callback(null);
    });
};

/**
 * @method getBlogs
 * @param name
 * @param page
 * @param callback
 * @desc 按页加载Blog
 */
Blog.getBlogs = function (name, page, callback) {
    var myblog = [];
    if (!name) {
        Post.count(null, function (err, count) {
            var query = Post.find(null, null, {
                skip: (page-1) * 6,
                limit: 6
            });
            query.sort({time: -1}).exec(function (err, blogs) {
                if (err) {
                    return callback(err);
                }

                //解析markdown为html
                /*var results = blogs.map(function (blog) {
                    blog.post = markdown.toHTML(blog.post);
                    return blog;
                });*/
                callback(null, blogs, count);
            });
        });
    } else {
        Post.count({
            "name": name
        }, function (err, count) {
            var query = Post.find({
                "name": name
            }, null, {
                skip: (page-1) * 6,
                limit: 6
            });
            query.sort({time: -1}).exec(function (err, blogs) {
                if (err) {
                    return callback(err);
                }
                //解析markdown为html
                /* var results = blogs.map(function (blog) {
                 blog.post = markdown.toHTML(blog.post);
                 return blog;
                 });*/
                callback(null, blogs, count);
            });
        });
    }
};

/**
 * @method getBlogs
 * @param name
 * @param callback
 * @desc 按页加载Blog
 */
Blog.getMyCare = function (name, callback) {
    var myblog = [];
    User.User.countCareByUser(name, function (err, user) {
        if (!err) {
            var care = user.care;
            care.forEach(function (item, index) {
                Post.findOne({
                    "name": item.name,
                    "time.day": item.day,
                    "title": item.title
                }, function (err, blog) {
                    if (!err) {
                        myblog.push(blog);
                    }
                });
            });
        }
    });
    setTimeout(function () {
        callback(null, myblog);
    }, 2000);
};

/**
 * @method getBlogs
 * @param name
 * @param callback
 * @desc 按页加载Blog
 */
Blog.getMyReprint = function (name, callback) {
    var myblog = [];
    User.User.countCareByUser(name, function (err, user) {
        if (!err) {
            var reprint = user.reprint;
            reprint.forEach(function (item, index) {
                Post.findOne({
                    "name": item.name,
                    "time.day": item.day,
                    "title": item.title
                }, function (err, blog) {
                    if (!err) {
                        myblog.push(blog);
                    }
                });
            });
        }
    });
    setTimeout(function () {
        callback(null, myblog);
    }, 2000);
};

/**
 * @method getOne
 * @param name
 * @param day
 * @param title
 * @param callback
 * @desc 查找某一篇Blog
 */
Blog.getOne = function (name, day, title, callback) {
    Post.findOne({
        "name": name,
        "time.day": day,
        "title": title
    }, function (err, blog) {
        if (err) {
            return callback(err);
        }

        if (blog) {
            //每访问一次pv就增加1
            Post.update({
                "name": name,
                "time.day": day,
                "title": title
            }, {
                $inc: {'pv': 1}
            }, function (err) {
                if (err) {
                    return callback(err);
                }
            });
            /*blog.post = markdown.toHTML(blog.post);*/
            blog.comments.map(function (comment) {
                /*comment.content = markdown.toHTML(comment.content);*/
                return comment;
            });
        }
        callback(null, blog);
    });
};

/**
 * @desc 返回原始发表的内容(markdown格式)
 */
Blog.edit = function (name, day, title, callback) {
    Post.findOne({
        "name": name,
        "time.day": day,
        "title": title
    }, function (err, blog) {
        if (err) {
            return callback(err);
        }
        callback(null, blog);
    });
};

/**
 * @desc update blog
 */
Blog.update = function (name, day, title, post, callback) {
    var date = new Date();
    Post.findOneAndUpdate({
        "name": name,
        "time.day": day,
        "title": title
    }, {
        $set: {
            time: tool.time(date),
            post: post
        }
    }, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

/**
 * @desc 删除Blog
 * @param name
 * @param day
 * @param title
 * @param callback
 */
Blog.remove = function (name, day, title, callback) {
    Post.remove({
        "name": name,
        "time.day": day,
        "title": title
    }, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};


/**
 * @desc 获取数据库中所有不同的标签
 * @param callback
 */
Blog.getTags = function (callback) {
    /**
     * @desc 找出给定键的所有不同值
     */
    Post.distinct('tags', function (err, tags) {
        if (err) {
            return callback(err);
        }
        callback(null, tags);
    });
};

/**
 * @desc 查找包含指定标签的文章
 * @param tag
 * @param callback
 */
Blog.getBlogsByTag = function (tag, callback) {
    Post.find({
        "tags": tag //查询所有tags数组中包含tag的blog
    })
    .sort({time: -1})
    .exec(function (err, blogs) {
        if (err) {
            return callback(err);
        }
        callback(null, blogs);
    });
};

/**
 * @desc 模糊查询
 * @param keyword
 * @param callback
 */
Blog.search = function (keyword, callback) {
    var pattern = new RegExp('^.*' + keyword + '.*$', 'i');
    Post.find({
        title: pattern
    })
    .sort({time: -1})
    .exec(function (err, blogs) {
        if (err) {
            return callback(err);
        }
        callback(err, blogs);
    });
};

/**
 * @desc 统计每个user的博客总数
 * @param name
 * @param callback
 */
Blog.countByUser = function (name, callback) {
    Post.count({
        "name": name
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
Blog.modifyIconByUserName = function (name, icon, callback) {
    Post.findOneAndUpdate({
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