const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');
router.get('/',async (ctx,next) => {
    //获取数据并渲染
    let result = await Db.find('admin',{});
    await ctx.render('admin/manager/list.html',{managers: result});
});
router.get('/add',async (ctx,next) => {
    await ctx.render('admin/manager/add.html');
});

router.post('/doAdd',async (ctx) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;``
    let rpassword = ctx.request.body.rpassword;

    //表单提交的数据
    if(!/^\w{4,15}/.test(username)) {
        await ctx.render("admin/error.html",{
            message:'用户名须为4-20位',
            redirect: ctx.state.__HOST__+'/admin/manager/add'
        });
    } else if(password!=rpassword){
        await ctx.render('admin/error',{
            message:'密码和确认密码不一致',
            redirect:ctx.state.__HOST__+'/admin/manager/add'
        })
    } else if (password.length < 6) {
        await ctx.render('admin/error',{
            message:'密码长度小于6位',
            redirect: ctx.state.__HOST__+'/admin/manager/add'
        })
    } else {
        let findResult = await Db.find('admin',{username: username});
        if(findResult.length == 0) {
            let insertResult = await Db.add('admin',{username:username,password:Tool.md5(password),state:0,last_time: ''});
            if (insertResult.result.ok) {
                ctx.redirect(ctx.state.__HOST__+'/admin/manager');
            } else {
                await ctx.render('admin/error',{
                    message:'服务器忙，请稍后再试',
                    redirect: ctx.state.__HOST__+'/admin/manager/add'
                })
            }

        } else {
            await ctx.render('admin/error',{
                message:'该用户名已存在',
                redirect: ctx.state.__HOST__+'/admin/manager/add'
            })
        }
    }

});
router.get('/delete',async (ctx,next) => {
    ctx.body = "我是admin下manager delete"
});
router.get('/edit',async (ctx,next) => {
    // console.log(ctx.query.id);
    //查询这条数据，获取用户信息用于展示
    let result = await Db.find('admin',{"_id":Db.getObjectId(ctx.query.id)});
    await ctx.render('admin/manager/edit',{userinfo: result[0]});
});

router.post('/doEdit',async (ctx) => {
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    let _id = ctx.request.body._id;

    //表单提交的数据
    if(password!=rpassword){
        await ctx.render('admin/error',{
            message:'密码和确认密码不一致',
            redirect:ctx.state.__HOST__+'/admin/manager/edit'
        })
    } else if (password.length < 6) {
        await ctx.render('admin/error',{
            message:'密码长度小于6位',
            redirect: ctx.state.__HOST__+'/admin/manager/edit'
        })
    } else {
        let updateResult = await Db.update('admin',{'_id': _id},{password: password});
        if (updateResult.result.ok) {
            ctx.redirect(ctx.state.__HOST__+'/admin/manager');
        } else {
            await ctx.render('admin/error',{
                message:'服务器忙，请稍后再试',
                redirect: ctx.state.__HOST__+'/admin/manager/edit'
            })
        }

    }

});

module.exports = router.routes();
