const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const render = require('koa-art-template');
const path = require('path');
const sd = require('silly-datetime');

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = function (value) {
        return sd.format(value, 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
//配置使用jsonp 可接口返回json数据
const jsonp = require('koa-jsonp')
app.use(jsonp());

//配置session
const session = require('koa-session');
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 50000000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
const serve = require('koa-static');
app.use(serve(__dirname + '/public'));
//引入子路由
const admin = require('./routes/admin');

app.use(async (ctx,next) => {
    //console.log(ctx);
    // ctx.session.userinfo = "";
    await next();
});


router.get('/', (ctx, next) => {

    console.log('这是直接访问域名走到的');
    ctx.render("index");
});

//配置子路由即访问/admin，对应admin.js
router.use('/admin',admin);

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
