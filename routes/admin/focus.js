const router = require('koa-router')();
router.get('/',async (ctx,next) => {
    ctx.body = "我是admin下轮播图首页"
});
router.get('/add',async (ctx,next) => {
    ctx.body = "我是admin下轮播图 add"
});
router.get('/delete',async (ctx,next) => {
    ctx.body = "我是admin下轮播图 delete"
});
router.get('/edit',async (ctx,next) => {
    ctx.body = "我是admin下轮播图 edit"
});

module.exports = router.routes();