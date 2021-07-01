// 复用代码
// 获取前一天
export function getNextDate(date) {
    let nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    return nextDate;
}
// 获取当前格式化的日期时间
export function getFormatDateTime(date) {
    let CurrDate = new Date(date);
    const resDate = [];
    const resTime = [];
    resDate.push(CurrDate.getFullYear()); //获取当前年份
    resDate.push(CurrDate.getMonth() + 1); //获取当前月份
    resDate.push(CurrDate.getDate()); //获取当前日
    // var day = CurrDate.getDay(); //获取当前星期几
    resTime.push(CurrDate.getHours()); //获取小时
    resTime.push(CurrDate.getMinutes()); //获取分钟
    resTime.push(CurrDate.getSeconds()); //获取秒
    return resDate.join('-') + ' ' + resTime.join(':');
}
// 获取当前格式化的日期
export function getFormatDate(date) {
    let CurrDate = new Date(date);
    const resDate = [];
    resDate.push(CurrDate.getFullYear()); //获取当前年份
    resDate.push(CurrDate.getMonth() + 1); //获取当前月份
    resDate.push(CurrDate.getDate()); //获取当前日
    return resDate.join('');
}
// 获取当前格式化的中文日期（不含年）
export function getChFormatDate(date) {
    let month = +date.slice(4, 6);
    let day = +date.slice(6, 8);
    return month + '/' + day;
}
// 获取随机token
export function geneToken() {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789'
    let token = "";
    for (let i = 0; i < 16; ++i)
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    return token;
}
// 是否纯数字
export function isPureNumbers(data) {
    return (Number(data) + '' !== NaN + '') ? true : false;
}