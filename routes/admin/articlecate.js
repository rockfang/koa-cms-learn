const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');
router.get('/',async (ctx,next) => {
    let result = await Db.find('articlecate',{});
    //数据处理
    let articleData = await Tool.processArticleData(result);
    await ctx.render('admin/articlecate//index.html',{articleData: articleData});
});
router.get('/add',async (ctx,next) => {

    let firstResult = await Db.find('articlecate',{'pid':'0'});
    await ctx.render('admin/articlecate/add.html',{firstList: firstResult});
});

router.post('/doAdd',async (ctx) => {
    let title = ctx.request.body.title;
    let pid = ctx.request.body.pid;
    let keywords = ctx.request.body.keywords;
    let state = ctx.request.body.state;
    let description = ctx.request.body.description;
    console.log(ctx.request.body);

    //表单提交的数据
    if(!/^\w{1,15}/.test(title)) {
        await ctx.render("admin/error.html",{
            message:'用户名须为1-15位',
            redirect: ctx.state.__HOST__+'/admin/articlecate/add'
        });
    } else if(!/^\w{1,10}/.test(keywords)){
        await ctx.render('admin/error',{
            message:'关键字须为1-10位',
            redirect:ctx.state.__HOST__+'/admin/articlecate/add'
        })
    } else {
        //同一层级下分类名不能相同
        let findResult = await Db.find('articlecate',{title: title,pid:pid});
        if(findResult.length == 0) {

            let insertResult = await Db.add('articlecate',{title:title,pid:pid,keywords:keywords,state: state,description:description,add_time: new Date()});
            if (insertResult.result.ok) {
                ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');
            } else {
                await ctx.render('admin/error',{
                    message:'服务器忙，请稍后再试',
                    redirect: ctx.state.__HOST__+'/admin/articlecate/add'
                })
            }

        } else {

            await ctx.render('admin/error',{
                message:'该分类名已存在',
                redirect: ctx.state.__HOST__+'/admin/articlecate/add'
            })
        }
    }

});
router.get('/delete',async (ctx,next) => {
    ctx.body = "我是admin下manager delete"
});
router.get('/edit',async (ctx,next) => {
    console.log(ctx.query.id);
    //查询这条数据，获取用户信息用于展示
    let firstResult = await Db.find('articlecate',{'pid':'0'});
    let result = await Db.find('articlecate',{"_id":Db.getObjectId(ctx.query.id)});
    await ctx.render('admin/articlecate/edit',{itemInfo: result[0],firstList:firstResult});
});

router.post('/doEdit',async (ctx) => {
    //更新这条数据
    console.log(ctx.request.body);
    let id = ctx.request.body.id;
    let title = ctx.request.body.title;
    let pid = ctx.request.body.pid;
    let keywords = ctx.request.body.keywords;
    let state = ctx.request.body.state;
    let description = ctx.request.body.description;

    let updateResult = await Db.update('articlecate',{'_id':Db.getObjectId(id)},{title:title,pid:pid,keywords:keywords,state:state,description:description});
    if(updateResult.result.ok) {
        ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');
    } else {
        await ctx.render('admin/error',{
            message:'服务器忙，请稍后再试',
            redirect: ctx.state.__HOST__+'/admin/articlecate/add'
        })
    }
});

module.exports = router.routes();
