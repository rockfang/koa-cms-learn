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

    console.log(Tool.processArticleData(catelist));

    await  ctx.render('admin/article/add',{
        catelist:Tool.processArticleData(catelist)
    });
});

//post接收数据
router.post('/doAdd', upload.single('pic'),async (ctx)=>{

    ctx.body = {
        filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
        body:ctx.req.body
    }

});

module.exports = router.routes();
