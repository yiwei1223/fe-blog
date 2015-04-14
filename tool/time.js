/**
 * Created by yiwei on 2015/4/11.
 */

/**
 * @method time
 * @param date 时间
 * @desc 格式化时间
 */
function time(date) {
    return time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
            + date.getDay(),
        minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
            + date.getDay() + " " + date.getHours() + ":"
            + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
}

exports.time = time;