/**
 * @file 统一操作 cookie
 */

const cookie = require('js-cookie');

// 如果当前是 HTTPS 环境，则默认让 cookie 走安全模式
/* if (window.location.protocol === 'https:') {
    cookie.defaults.secure = true;
} */

export default cookie;
