const router = require('koa-router')();
router.get('/',async (ctx,next) => {
    await ctx.render('admin/user/list.html');
});
router.get('/add',async (ctx,next) => {
    await ctx.render('admin/user/add.html');
});
router.get('/delete',async (ctx,next) => {
    ctx.body = "我是admin下user delete"
});
router.get('/edit',async (ctx,next) => {
    ctx.body = "我是admin下user edit"
});

module.exports = router.routes();