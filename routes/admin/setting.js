const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');

router.get('/',async (ctx,next) => {
    //获取数据并渲染
    let result = await Db.find('setting',{});
    await  ctx.render('admin/setting/index',{list:result[0]});
});
//执行编辑数据
router.post('/doEdit',Tool.multerUpload().single('site_logo'),async (ctx)=>{
    let site_title=ctx.req.body.site_title;
    let site_logo=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let site_keywords=ctx.req.body.site_keywords;
    let site_description=ctx.req.body.site_description;
    let site_icp=ctx.req.body.site_icp;
    let site_qq=ctx.req.body.site_qq;
    let site_tel=ctx.req.body.site_tel;
    let site_address=ctx.req.body.site_address;
    let site_state=ctx.req.body.site_state;
    let add_time=Tool.getCurrentTime();


    if(site_logo) {
        var json={
            site_title,site_logo,site_keywords,site_description,site_icp,
            site_qq,site_tel,site_address,site_state,add_time
        };
    } else {
        var json={
            site_title,site_keywords,site_description,site_icp,
            site_qq,site_tel,site_address,site_state,add_time
        };
    }
    await  Db.update('setting',{},json);
    ctx.redirect(ctx.state.__HOST__+'/admin/setting');

});

module.exports=router.routes();