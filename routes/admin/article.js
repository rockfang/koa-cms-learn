const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');
const PAGE_SIZE = 5;
router.get('/',async (ctx,next) => {
    let currentPage = ctx.query.page || 1;
    //获取页数用于分页设置
    let count= await Db.count('article',{});
    //获取数据并渲染
    let result = await Db.find('article',{},{title:1},{page:currentPage,pageSize:PAGE_SIZE});

    await ctx.render('admin/article/index.html',
        {   newsList: result,
            totalPages: Math.ceil(count/PAGE_SIZE),
            page: currentPage
        });
});
router.get('/add',async (ctx,next) => {
});

module.exports = router.routes();
