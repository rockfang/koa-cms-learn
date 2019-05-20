/**
 * 处理接口请求
 *
 */

const router = require('koa-router')();
const Db = require('../../model/Db');
router.get('/changeState',async (ctx) => {
    let collectionName = ctx.query.collectionName;
    let attr = ctx.query.attr;//要改变的参数,对应数据库表中一个字段
    let id = ctx.query.id;
    console.log(collectionName);
    console.log(attr);
    console.log(id);

    let result = await Db.find(collectionName,{"_id": Db.getObjectId(id)});
    console.log("query result:"+result[0]);

    if (result.length != 0) {
        let serverAttr = result[0][attr];
        let destAttr = {};
        if (serverAttr == 0) {
            destAttr = { /*es6 属性名表达式*/
                [attr]: 1
            };
        } else {
            destAttr = { /*es6 属性名表达式*/
                [attr]: 0
            };
        }
        let updateResult = await Db.update(collectionName,{_id: Db.getObjectId(id)},destAttr);
        console.log("updateResult：" + updateResult);
        if(updateResult) {
            ctx.body = {success: true,message: "更新成功"};
        } else {
            ctx.body = {success: false,message: "更新失败"};
        }

    } else {
        ctx.body = {success: false,message: "参数错误"};
    }
});

module.exports = router.routes();