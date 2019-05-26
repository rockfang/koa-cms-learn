const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');
//配置上传图片

router.get('/',async (ctx,next) => {
    //获取数据并渲染
    let result = await Db.find('nav',{},{},{

        pageSize:100,page:1,//这里为了不分页，且能调用统一封装方法排序
        sort: {
            'add_time': -1
        }
    });
    await  ctx.render('admin/nav/list',{list:result});
});
router.get('/add',async (ctx)=>{
    await  ctx.render('admin/nav/add');
});
router.post('/doAdd',async (ctx)=>{

    let title=ctx.request.body.title;

    let url=ctx.request.body.url;

    let sort=ctx.request.body.sort;

    let state=ctx.request.body.state;

    let add_time=Tool.getCurrentTime();


    await Db.add('nav',{
        title,url,sort,state,add_time
    });
    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/nav');
});
//编辑
router.get('/edit',async (ctx)=>{
    let id = ctx.query.id;
    let result = await Db.find('nav',{_id: Db.getObjectId(id)});
    await ctx.render('admin/nav/edit',{list:result[0]});
});
//执行编辑数据
router.post('/doEdit',async (ctx)=>{

    let id=ctx.request.body.id;

    let title=ctx.request.body.title;

    let url=ctx.request.body.url;

    let sort=ctx.request.body.sort;

    let state=ctx.request.body.state;

    let add_time=Tool.getCurrentTime();

    let json={
        title,url,sort,state,add_time
    };
    await  Db.update('nav',{'_id':Db.getObjectId(id)},json);
    ctx.redirect(ctx.state.__HOST__+'/admin/nav');

});

module.exports=router.routes();