/**
 * 封装前端请求方法
 */

let app = {
    /**
     *
     * @param el dom节点
     * @param collectionName 操作数据库表名
     * @param attr 参数，如当前状态
     * @param id   当前用户id
     */
      toggle: function (el,collectionName,attr,id) {
          $.get('/admin/changeState',{
              collectionName: collectionName,
              attr: attr,
              id: id
          },function (data) {
              console.log('changeState接口请求结果：' + JSON.stringify(data));
              if(data.success) {
                  if(el.src.indexOf('yes') != -1) {
                      el.src = '/admin/images/no.gif';
                  } else {
                      el.src = '/admin/images/yes.gif';
                  }
              }
          })
      }
};