const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');
//配置上传图片

router.get('/',async (ctx,next) => {
    //获取数据并渲染
    let page=ctx.query.page ||1;
    let pageSize=3;
    let result= await Db.find('link',{},{},{
        page,
        pageSize,
        sort: {
            "add_time": -1
        }
    });
    let count= await  Db.count('link',{});  /*总数量*/
    await  ctx.render('admin/link/list',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize) | 0
    });
});
router.get('/add',async (ctx)=>{
    await  ctx.render('admin/link/add');
});
router.post('/doAdd',Tool.multerUpload().single('pic'),async (ctx)=>{

    let title=ctx.req.body.title;

    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';

    let url=ctx.req.body.url;

    let sort=ctx.req.body.sort;

    let state=ctx.req.body.state;

    let add_time=Tool.getCurrentTime();


    await Db.add('link',{
        title,pic,url,sort,state,add_time
    });
    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/link');
});
//编辑
router.get('/edit',async (ctx)=>{

    let id = ctx.query.id;

    let result=await Db.find('link',{"_id":Db.getObjectId(id)});

    await ctx.render('admin/link/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage
    });

});
//执行编辑数据
router.post('/doEdit',Tool.multerUpload().single('pic'),async (ctx)=>{

    let id=ctx.req.body.id;

    let title=ctx.req.body.title;

    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';

    let url=ctx.req.body.url;

    let sort=ctx.req.body.sort;

    let status=ctx.req.body.status;

    let add_time=Tool.getCurrentTime();

    let prevPage=ctx.req.body.prevPage;


    if(pic){

        var json={

            title,pic,url,sort,status,add_time
        }
    }else{
        var json={

            title,url,sort,status,add_time
        }

    }
    await  Db.update('link',{'_id':Db.getObjectId(id)},json);
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/link');
    }

})

module.exports=router.routes();