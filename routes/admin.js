const router = require('koa-router')();
//引入子路由
const index = require('./admin/index');
const user = require('./admin/user');
const manager = require('./admin/manager');
const articlecate = require('./admin/articlecate');
const article = require('./admin/article');
const login = require('./admin/login');
const md5 = require('md5');
const url = require('url');
//配置中间件
router.use(async (ctx,next) => {

    console.log(ctx.request.url);
    let pathname = url.parse(ctx.request.url).pathname;//获取/admin/login/getCode?ts=770.0280020629946中/admin/login/getCode

    ctx.state.__HOST__ = "http://" + ctx.request.header.host;//配置全局host用于模板引擎渲染
    ctx.state.G = {
        userinfo: ctx.session.userinfo,//保存登录信息用于显示
        itemArr: getItemName(pathname) //用于侧边栏条目及子条目选中
    };
    //设置权限
    if(ctx.session.userinfo) {
        await next();
    } else {
        //未登录访问非登录页就跳转到登录页
        if (pathname == '/admin/login' || pathname == '/admin/login/doLogin' || pathname == '/admin/login/getCode') {
            await next();
        } else {
            ctx.redirect('/admin/login');
        }
    }

});

router.get('/',async (ctx,next) => {
    await ctx.render('admin/index.html');
});

router.use(index);
router.use('/user',user);
router.use('/manager',manager);
router.use('/articlecate',articlecate);
router.use('/article',article);
router.use('/login',login);

//pathname 可用于通过路由中的类别选中不同的slide条目  /admin/login/getCode
function getItemName(pathname) {
    let arr = pathname.substring(1).split('/');//[ 'admin', 'manager', 'add' ]
    //console.log(arr);
    return arr;
}

module.exports = router.routes();
