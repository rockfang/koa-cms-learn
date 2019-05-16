const router = require('koa-router')();
//引入子路由
const focus = require('./admin/focus');
const login = require('./admin/login');
router.get('/',async (ctx,next) => {
    ctx.body = "我是admin首页"
});

router.use('/focus',focus);
router.use('/login',login);

module.exports = router.routes();