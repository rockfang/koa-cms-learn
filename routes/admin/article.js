const router = require('koa-router')();
const Db = require('../../model/Db');
const Tool = require('../../model/OperationTools');

//配置文件上传插件multer
const multer = require('koa-multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
    },
    filename: function (req, file, cb) {   /*图片上传完成重命名*/
        var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
let upload = multer({ storage: storage });

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
    //查询分类数据
    let catelist=await Db.find('articlecate',{});

    await  ctx.render('admin/article/add',{
        catelist:Tool.processArticleData(catelist)
    });
});

router.get('/edit',async (ctx,next) => {
    let articleId = ctx.query.id;
    //查询数据预填
    let catelist=await Db.find('articlecate',{});//分类列表
    let article=await Db.find('article',{'_id': Db.getObjectId(articleId)});//当前文章信息
    let currentCate=await Db.find('articlecate',{'_id': Db.getObjectId(article[0].pid)});//当前文章所在分类
    console.log(article);
    await ctx.render('admin/article/edit',{
        currentCate: currentCate[0],
        article: article[0],
        catelist:Tool.processArticleData(catelist),//catelist是组装好的数据列表
    });
});
//post接收数据
router.post('/doAdd', upload.single('img_url'),async (ctx)=>{

    //往article表添加数据。1.查询是否有重复数据。2.添加。参数组装
    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim();
    let author=ctx.req.body.author.trim();
    let state=ctx.req.body.state;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? processImgURl(ctx.req.file.path) :'';//处理url中public目录public\upload\20180331\1522489192188.png

    //属性的简写
    let json={
        pid,catename,title,author,state,is_best,is_hot,is_new,keywords,description,content,img_url
    };

    let result=await Db.add('article',json);

    if(result.result.ok) {
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/article');
    } else {
        await ctx.render('admin/error',{
            message:'服务器忙，请稍后再试',
            redirect: ctx.state.__HOST__+'/admin/article/add'
        })
    }

});

function processImgURl(src) {
    let index = src.indexOf('\\');
    return src.substring(index+1);
}

module.exports = router.routes();
