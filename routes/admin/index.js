/**
 * 处理接口请求
 * 封装在这儿，是因为index.js对应admin路由，即其他路由的
 * 上级路由。所以这里处理公共方法合适。
 */
const router = require('koa-router')();
const Db = require('../../model/Db');
router.get('/changeState',async (ctx) => {
    let collectionName = ctx.query.collectionName;
    let attr = ctx.query.attr;//要改变的参数,对应数据库表中一个字段
    let id = ctx.query.id;

    let result = await Db.find(collectionName,{"_id": Db.getObjectId(id)});
    console.log("query result:"+result[0]);

    if (result.length != 0) {
        let serverAttr = result[0][attr];
        let destAttr = {};
        if (serverAttr == 0) {
            destAttr = { /*es6 属性名表达式*/
                [attr]: "1"
            };
        } else {
            destAttr = { /*es6 属性名表达式*/
                [attr]: "0"
            };
        }
        let updateResult = await Db.update(collectionName,{_id: Db.getObjectId(id)},destAttr);
        if(updateResult) {
            ctx.body = {success: true,message: "更新成功"};
        } else {
            ctx.body = {success: false,message: "更新失败"};
        }

    } else {
        ctx.body = {success: false,message: "参数错误"};
    }
});


router.get('/changeSort',async (ctx) => {
    let collectionName = ctx.query.collectionName;
    let sort = ctx.query.sort;//要改变的参数,对应数据库表中一个字段
    let id = ctx.query.id;

    let updateResult = await Db.update(collectionName,{_id: Db.getObjectId(id)},{sort:sort});
    if(updateResult) {
        ctx.body = {success: true,message: "更新成功"};
    } else {
        ctx.body = {success: false,message: "更新失败"};
    }

});

router.get('/remove',async (ctx) => {

    let fromPage = ctx.request.headers['referer'];
    try {
        let collectionName = ctx.query.collectionName;
        let id = ctx.query.id;
        console.log(collectionName);
        console.log(id);

        let result = await Db.delete(collectionName,{'_id':Db.getObjectId(id)});
        if(result.result.ok) {
            //删除二级目录
            let secondResult = await Db.delete(collectionName,{'pid':id.toString()});
            console.log("second "+secondResult.result);
            //子目录未删除也不影响显示 因此不做二级目录删除成功判断
            ctx.redirect(fromPage);
        } else {
            ctx.render('admin/error',{redirect: fromPage,message: "删除失败，请重试"});
        }
    } catch (e) {
        ctx.render('admin/error',{redirect: fromPage,message: e});
    }

});


module.exports = router.routes();
