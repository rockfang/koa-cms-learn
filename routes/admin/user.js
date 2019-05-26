const router = require('koa-router')();
/**
 * 登录展示首页，暂未做数据展示处理
 */
router.get('/',async (ctx,next) => {
    await ctx.render('admin/user/index.html');
});
// router.get('/',async (ctx,next) => {
//     await ctx.render('admin/user/list.html');
// });
// router.get('/add',async (ctx,next) => {
//     await ctx.render('admin/user/add.html');
// });
// router.get('/index',async (ctx,next) => {
//     await ctx.render('admin/user/index.html');
// });

module.exports = router.routes();