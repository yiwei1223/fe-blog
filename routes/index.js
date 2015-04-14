/**
 * Created by yiwei on 2015/4/9.
 * @desc 路由配置
 */
var User = require('../models/user'),
    Blog = require('../models/post').Blog,
    Comment = require('../models/comment'),
    fs = require('fs'),
    util = require('util'),
    tool = require('../tool/time');

module.exports = function (app) {
    /**
     * @desc 主页路由
     */
    app.get('/', function (req, res, next) {
        //判断是否是第一页,并把请求页数转换成number类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        /* 获取page的所有文章, 一页6篇文章 */
        Blog.getBlogs(null, page, function (err, blogs, total) {
            if (err) {
                blogs = null;
            }
            res.render('index', {
                user: req.session.user,
                posts: blogs,
                page: page,
                isFirstPage: (page -1) === 0,
                isLastPage: ((page -1) * 6 + blogs.length) === total,
                total: (total%6 !=0) ? parseInt(total/6) + 1 : parseInt(total/6)
            });
        });
    });

    /**
     * @desc 获取自己的博客列表
     */
    app.get('/myblog', function (req, res, next) {
        //判断是否是第一页,并把请求页数转换成number类型
        var page = req.query.p ? parseInt(req.query.p) : 1,
            name = req.session.user.name;

        //返回第page页的文章
        Blog.getBlogs(name, page, function (err, blogs, total) {
            if (err) {
                blogs = null;
            }
            if (err) {
                blogs = null;
            }
            res.render('index', {
                user: req.session.user,
                posts: blogs,
                page: page,
                isFirstPage: (page -1) === 0,
                isLastPage: ((page -1) * 6 + blogs.length) === total,
                total: (total%6 !=0) ? parseInt(total/6) + 1 : parseInt(total/6)
            });
        });
    });

    /**
     * @desc 登录页路由
     */
    app.get('/login', function (req, res, next) {
        res.render('login', {
            user: req.session.user
        });
    });

    app.post('/login', function (req, res, next) {
        var name = req.body.name,
            pwd = req.body.password;
        User.findByName(name, function (err, user) {
            if (!user) {
                res.json(util.format('%j', {
                    code: 400,
                    msg: '用户名不正确！'
                }));
            } else if (user.password !== pwd) {//检测密码是否一致
                res.json(util.format('%j', {
                    code: 400,
                    msg: '密码错误'
                }));
            } else {
                //用户名和密码正确
                req.session.user = user;//设置session
                res.json(util.format('%j', {
                    code: 200,
                    msg: '登陆成功'
                }));
            }
        });
    });

    /**
     * @desc 注册路由
     */
    app.get('/reg', function (req, res, next) {
        res.render('register', {
            user: req.session.user
        });
    });

    app.post('/reg', function (req, res, next) {
        var name = req.body.name,
            pwd = req.body.password,
            newUser = new User({
                name: name,
                password: pwd
            });
        newUser.save(function (err, data) {
            if (err) {
                res.json(util.format('%j', {
                    code: 400
                }));
            } else {
                res.json(util.format('%j', {
                    code: 200
                }));
            }
        });
    });

    /**
     * @desc 判断当前用户名是否已经注册
     */
    app.post('/isregister', function (req, res, next) {
        User.findByName(req.body.name, function (err, user) {
            if (!user) {
                res.json(util.format('%j', {
                    code: 200
                }));
            } else {
                res.json(util.format('%j', {
                    code: 400
                }));
            }
        });
    });

    /**
     * @desc 退出路由
     */
    app.get('/logout', function (req, res, next) {
        req.session.user = null;
        res.redirect('/');
    });

    /**
     * @desc 发表博客路由
     */
    app.get('/post', function (req, res, next) {
        res.render('post', {
            user: req.session.user
        });
    });

    app.post('/post', function (req, res, next) {
        var currentUser = req.session.user,
            tags = [req.body.tag1, req.body.tag2, req.body.tag3];
        tags.filter(function (tag) {
            if (tag != "") {
                return tag;
            }
        });
        var blog = new Blog(currentUser.name, currentUser.head, req.body.title,
                tags, req.body.post);
        blog.publish(function (err) {
            if (err) {
                res.json(util.format('%j', {
                    code: 400,
                    msg: '发表失败'
                }));
            } else {
                res.json(util.format('%j', {
                    code: 200,
                    msg: '发表成功'
                }));
            }
        });
    });

    /**
     * @desc 访问具体文章页面路由
     */
    app.get('/u/:name/:day/:title', function (req, res, next) {
        Blog.getOne(req.params.name, req.params.day, req.params.title, function (err, blog) {
            if (err) {
                return res.redirect('/');
            }
            res.render('article', {
                title: req.params.title,
                post: blog,
                user: req.session.user
            });
        });
    });

    /**
     * @desc 留言路由配置
     */
    app.post('/comment', function (req, res, next) {
        var comment = {
            name: req.body.forWho,
            head: req.session.user.head,
            fromWho: req.body.name,
            time: tool.time(new Date()),
            content: req.body.content
        };
        var newComment = new Comment(req.body.forWho, req.body.day, req.body.title,
            comment);
        newComment.save(function (err) {
            if (err) {
                res.json(util.format('%j', {
                    code: 400,
                    msg: '评论失败！'
                }));
            } else {
                res.json(util.format('%j', {
                    code: 200,
                    msg: '评论成功'
                }));
            }
        });
    });

    /**
     * @desc 修改blog路由
     */
    app.get('/edit/:name/:day/:title', function (req, res, next) {
        var currentUser = req.session.user;
        Blog.edit(currentUser.name, req.params.day, req.params.title, function (err, blog) {
            if (err) {
                return res.redirect('/');
            }
            res.render('edit', {
                post: blog,
                user: req.session.user
            });
        });
    });

    app.post('/edit', function (req, res, next) {
        var currentUser = req.session.user;
        Blog.update(currentUser.name, req.body.day, req.body.title, req.body.post,
            function (err) {
                var url = 'u/' + currentUser.name + '/' + req.body.day + '/' +
                    req.body.title;
                if (err) {
                    res.json(util.format('%j', {
                        code: 400,
                        msg: '修改失败！'
                    }));
                } else {
                    res.json(util.format('%j', {
                        code: 200,
                        msg: '修改成功',
                        url: url
                    }));
                }
            });
    });

    /**
     * @desc 删除文章
     */
    app.get('/remove/:name/:day/:title', function (req, res, next) {
        var currentUser = req.session.user;
        Blog.remove(currentUser.name, req.params.day, req.params.title,
            function (err) {
                if (err) {
                    return res.redirect('back');
                }
                res.redirect('/');
            });
    });


    /**
     * @desc 标签页路由
     */
    app.get('/tags', function (req, res, next) {
        Blog.getTags(function (err, tags) {
            if (err) {
                return res.redirect('/');
            }
            res.render('tags', {
                user: req.session.user,
                posts: tags
            });
        });
    });

    /**
     * @desc 指定标签页路由
     */
    app.get('/tags/:tag', function (req, res, next) {
        Blog.getBlogsByTag(req.params.tag, function (err, blogs) {
            if (err) {
                return res.redirect('/');
            }
            res.render('tag', {
                user: req.session.user,
                posts: blogs,
                _tag: req.params.tag
            });
        });
    });
};
