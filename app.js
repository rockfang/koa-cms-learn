const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const render = require('koa-art-template');
const path = require('path');

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

const serve = require('koa-static');
app.use(serve(__dirname + '/public'));
//引入子路由
const admin = require('./routes/admin');

app.use(async (ctx,next) => {
    console.log(ctx);
    next();
});

router.get('/', (ctx, next) => {
    ctx.render("index");
});

//配置子路由即访问/admin，对应admin.js
router.use('/admin',admin);

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);