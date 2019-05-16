const router = require('koa-router')();
router.get('/',async (ctx,next) => {
    await ctx.render("admin/login");
});
router.get('/add',async (ctx,next) => {
    ctx.body = "我是admin下login add"
});
router.get('/delete',async (ctx,next) => {
    ctx.body = "我是admin下login delete"
});
router.get('/edit',async (ctx,next) => {
    ctx.body = "我是admin下login edit"
});

module.exports = router.routes();