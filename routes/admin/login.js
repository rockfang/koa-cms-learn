const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');
const svgCaptcha = require('svg-captcha');
router.get('/',async (ctx,next) => {
    //console.log(Tool.md5("ifang1245"));
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


router.get('/loginOut',async (ctx,next) => {
    ctx.session.userinfo = "";
    ctx.redirect(ctx.state.__HOST__ + "/admin/login");
});


router.get('/getCode',async (ctx,next) => {
    let captcha = svgCaptcha.create(
        {
            size:4,
            fontSize: 50,
            width: 120,
            height:30,
            background:"#cc9966"
        });
    ctx.session.code=captcha.text;//验证码文本
    ctx.response.type = 'image/svg+xml';
    ctx.body=captcha.data;//组成的验证码展示html
});

router.post('/doLogin',async (ctx,next) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let code = ctx.request.body.code;
    //验证码校验
    if(code.toLowerCase() != ctx.session.code.toLowerCase()) {
        ctx.body= "验证码错误";
        ctx.render("admin/error.html",{
            message:'验证码错误',
            redirect: ctx.state.__HOST__+'/admin/login'
        });
        return;
    }

    let result = await Db.find('admin',{username: username,password:Tool.md5(password)});
    if (result.length != 0) {
        //登录成功设置session
        ctx.session.userinfo = result[0];
        //更新时间
        await Db.update('admin',{_id: Db.getObjectId(result[0]._id)},{last_time: new Date()});

        ctx.redirect(ctx.state.__HOST__+'/admin/user');
    } else {
        // 登录失败 提示
        ctx.render("admin/error.html",{
            message:'用户名或密码错误',
            redirect: ctx.state.__HOST__+'/admin/login'
        });
    }

    //校验并存cookie
   // await ctx.redirect('/admin/index.html')
});

module.exports = router.routes();
