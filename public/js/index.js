/**
 * Created by yiwei on 2015/4/9.
 */
$(function () {
    /* 注册监听事件 */
    $('#register').on('click', function () {
        if ($('input[name="reg-password"]').val() != $('.repeat-pwd').val()) {
            $('.alert').html('密码不一致').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
            }, 1000);
            return;
        }
        $.ajax({
            url: '/reg',
            type: 'POST',
            data: {
                name: $('input[name="reg-username"]').val(),
                password: $('input[name="reg-password"]').val()
            },
            dataType: 'json',
            success: function (data) {
                var result = JSON.parse(data);
                if (result['code'] == 200) {
                    $('.alert').html('恭喜您，注册成功').addClass('success').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('success').html('').css('display', 'none');
                        window.location.href = 'http://localhost:3000/login';
                    }, 1000);
                } else {
                    $('.alert').html('很遗憾，注册失败').addClass('error').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('error').html('').css('display', 'none');
                    }, 1000);
                }
            }
        });
    });

    $('input[name="reg-username"]').on('blur', function () {
        if (!$(this).val()) {
            $('.alert').html('用户名不能为空').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
            }, 1000);
            return;
        }
        $.ajax({
            url: '/isregister',
            type: 'POST',
            data: {
                name: $(this).val()
            },
            dataType: 'json',
            success: function (data) {
                var result = JSON.parse(data);
                if (result['code'] != 200) {
                    $('.alert').html('该用户名已经注册').addClass('error').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('error').html('').css('display', 'none');
                    }, 1000);
                }
            }
        });
    });

    $('input[name="reg-password"]').on('blur', function () {
        if (!$(this).val()) {
            $('.alert').html('密码不能为空').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
            }, 1000);
            return;
        }
    });

    $('.repeat-pwd').on('blur', function () {
        if ($(this).val() != $('.password').val()) {
            $('.alert').html('两次密码不一致').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
            }, 1000);
            return;
        }
    });

    /* 登录事件监听 */
    $('#login').on('click', function () {
        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                name: $('input[name="login-username"]').val(),
                password: $('input[name="login-password"]').val()
            },
            dataType: 'json',
            success: function (data) {
                var result = JSON.parse(data);
                if (result['code'] == 400) {
                    $('.alert').html(result['msg']).addClass('error').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('error').html('').css('display', 'none');
                    }, 1000);
                } else {
                    $('.alert').html(result['msg']).addClass('success').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                       $('.alert').removeClass('success').html('').css('display', 'none');
                       window.location.href = 'http://localhost:3000/';
                    }, 1000);
                }
            }
        });
    });

    /* 发表事件监听 */
    $('#post').on('click', function (ev) {
        if ($('#blog-title').val() == '') {
            $('.alert').html('请输入文章主题').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
            }, 1000);
        } else {
            $.ajax({
                url: '/post',
                type: 'POST',
                data: {
                    title: $('#blog-title').val(),
                    tag1: $('#tag1').val(),
                    tag2: $('#tag2').val(),
                    tag3: $('#tag3').val(),
                    post: $('#blog').val()
                },
                dataType: 'json',
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result['code'] == 400) {
                        $('.alert').html(result['msg']).addClass('error').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('error').html('').css('display', 'none');
                        }, 1000);
                    } else {
                        $('.alert').html(result['msg']).addClass('success').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('success').html('').css('display', 'none');
                            window.location.href = 'http://localhost:3000/';
                        }, 1000);
                    }
                }
            });
        }
    });

    $('#next').on('click', function () {
        $('.alert').html('已经是最后一页了！').addClass('warn').css({
            'display': 'block',
            'transition': 'all .5s linear'
        });
        setTimeout(function () {
            $('.alert').removeClass('warn').html('').css('display', 'none');
        }, 1000);
    });

    $('#prev').on('click', function () {
        $('.alert').html('已经是第一页了！').addClass('warn').css({
            'display': 'block',
            'transition': 'all .5s linear'
        });
        setTimeout(function () {
            $('.alert').removeClass('warn').html('').css('display', 'none');
        }, 1000);
    });

    $('.go').on('click', function () {
        var pages = $(this).attr('data-pages'),
            currentPage = $(this).attr('data-currentPage'),
            goPage = $('#page').val();
        if (goPage < 1 || goPage > pages) {
            $('.alert').html('当前页不存在！').addClass('warn').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('warn').html('').css('display', 'none');
            }, 1000);
            return;
        } else if (goPage == currentPage) {
            return;
        } else {
            window.location = 'http://localhost:3000/?p=' + goPage;
        }
    });


    /* 评论事件监听 */
    $('#comments').on('click', function () {
        var user = $(this).attr('data-commentfrom');
        if (user == "") {//先登录
            $('.alert').html('请先登录！').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
                window.location = 'http://localhost:3000/login';
            }, 1000);
        } else {
            $.ajax({
                url: '/comment',
                type: 'POST',
                data: {
                    name: user,
                    forWho: $('#comments').attr('data-commentTo'),
                    content: $("textarea[name='comments']").val(),
                    title: $('#blog-title').html(),
                    day: $('.posttime').html()
                },
                dataType: 'json',
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result['code'] == 400) {
                        $('.alert').html(result['msg']).addClass('error').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('error').html('').css('display', 'none');
                        }, 1000);
                    } else {
                        $('.alert').html(result['msg']).addClass('success').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('success').html('').css('display', 'none');
                            window.location.reload();
                        }, 1000);
                    }
                }
            });
        }
    });

    /* 点击回复按钮 */
    $('.reply').on('click', function () {
        var prev = $(this).prev('.bloger').find('.who').html();
        $("textarea[name='comments']").val('@' + prev);
        $('#comments').attr('data-forwho', prev)
    });

    /* 修改blog */
    $('#edit').on('click', function () {
        var _ = $(this);
        $.ajax({
            url: '/edit',
            type: 'POST',
            data: {
                day: _.attr('data-day'),
                title: _.attr('data-title'),
                post: $('#editblog').val()
            },
            dataType: 'json',
            success: function (data) {
                var result = JSON.parse(data);
                if (result['code'] == 400) {
                    $('.alert').html(result['msg']).addClass('error').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('error').html('').css('display', 'none');
                    }, 1000);
                } else {
                    $('.alert').html(result['msg']).addClass('success').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('success').html('').css('display', 'none');
                        window.location = 'http://localhost:3000/' + result['url'];
                    }, 1000);
                }
            }
        });
    });

    /* 修改个人信息 */
    $('#save-edit').on('click', function () {
        $.ajax({
            url: '/edituserinfo',
            type: 'POST',
            data: {
                head: '',
                sex: $('input[name="sex"]:checked').val(),
                motto: $('#motto').val(),
                address: $('#address').val(),
                QQ: $('#QQ').val(),
                work: $('#work').val()
            },
            dataType: 'json',
            success: function (data) {
                var result = JSON.parse(data);
                if (result['code'] == 400) {
                    $('.alert').html(result['msg']).addClass('error').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('error').html('').css('display', 'none');
                    }, 1000);
                } else {
                    $('.alert').html(result['msg']).addClass('success').css({
                        'display': 'block',
                        'transition': 'all .5s linear'
                    });
                    setTimeout(function () {
                        $('.alert').removeClass('success').html('').css('display', 'none');
                        window.location = 'http://localhost:3000/' + result['url'];
                    }, 1000);
                }
            }
        });
    });

    /* 关注 */
    $('.care-icon').on('click', function () {
        if ($(this).attr('data-user') == "") {//未登录
            $('.alert').html('请先登录吧！').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
                window.location = 'http://localhost:3000/login';
            }, 1000);
        } else if ($(this).attr('data-user') == $(this).attr('data-name')) {//自己不能关注自己
            $('.alert').html('自己不能关注自己哟！！').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
            }, 1000);
        } else {
            $.ajax({
                url: '/care',
                type: 'POST',
                data: {
                    name: $(this).attr('data-name'),
                    day: $(this).attr('data-day'),
                    title: $(this).attr('data-title')
                },
                dataType: 'json',
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result['code'] == 400) {
                        $('.alert').html(result['msg']).addClass('error').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('error').html('').css('display', 'none');
                        }, 1000);
                    } else {
                        $('.alert').html(result['msg']).addClass('success').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('success').html('').css('display', 'none');
                            window.location = window.location.href;
                        }, 1000);
                    }
                }
            });
        }
    });

    /* 转发 */
    $('.reprinted-icon').on('click', function () {
        if ($(this).attr('data-user') == "") {//未登录
            $('.alert').html('请先登录吧！').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
                window.location = 'http://localhost:3000/login';
            }, 1000);
        } else if ($(this).attr('data-user') == $(this).attr('data-name')) {//自己不能转发自己
            $('.alert').html('不能转发自己的文章哟！！').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
            }, 1000);
        } else {
            $.ajax({
                url: '/reprint',
                type: 'POST',
                data: {
                    name: $(this).attr('data-name'),
                    day: $(this).attr('data-day'),
                    title: $(this).attr('data-title')
                },
                dataType: 'json',
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result['code'] == 400) {
                        $('.alert').html(result['msg']).addClass('error').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('error').html('').css('display', 'none');
                        }, 1000);
                    } else {
                        $('.alert').html(result['msg']).addClass('success').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('success').html('').css('display', 'none');
                            window.location = window.location.href;
                        }, 1000);
                    }
                }
            });
        }
    });

    /* 撤销关注 */
    $('.litter_icon_collectioned').on('click', function () {
        if ($(this).attr('data-user') == "") {//未登录
            $('.alert').html('请先登录吧！').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
                window.location = 'http://localhost:3000/login';
            }, 1000);
        } else {
            $.ajax({
                url: '/removecare',
                type: 'POST',
                data: {
                    name: $(this).attr('data-name'),
                    day: $(this).attr('data-day'),
                    title: $(this).attr('data-title')
                },
                dataType: 'json',
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result['code'] == 400) {
                        $('.alert').html(result['msg']).addClass('error').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('error').html('').css('display', 'none');
                        }, 1000);
                    } else {
                        $('.alert').html(result['msg']).addClass('success').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('success').html('').css('display', 'none');
                            window.location = window.location.href;
                        }, 1000);
                    }
                }
            });
        }
    });

    /* 撤销转发 */
    $('.reted').on('click', function () {
        if ($(this).attr('data-user') == "") {//未登录
            $('.alert').html('请先登录吧！').addClass('error').css({
                'display': 'block',
                'transition': 'all .5s linear'
            });
            setTimeout(function () {
                $('.alert').removeClass('error').html('').css('display', 'none');
                window.location = 'http://localhost:3000/login';
            }, 1000);
        } else {
            $.ajax({
                url: '/removereprint',
                type: 'POST',
                data: {
                    name: $(this).attr('data-name'),
                    day: $(this).attr('data-day'),
                    title: $(this).attr('data-title')
                },
                dataType: 'json',
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result['code'] == 400) {
                        $('.alert').html(result['msg']).addClass('error').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('error').html('').css('display', 'none');
                        }, 1000);
                    } else {
                        $('.alert').html(result['msg']).addClass('success').css({
                            'display': 'block',
                            'transition': 'all .5s linear'
                        });
                        setTimeout(function () {
                            $('.alert').removeClass('success').html('').css('display', 'none');
                            window.location = window.location.href;
                        }, 1000);
                    }
                }
            });
        }
    });
});