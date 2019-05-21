const md5 = require('md5');

const Tool = {
    md5: function (src) {
       return md5(src);
    },
    processArticleData: function (srcArr) {
        let resultArr = [];
        let length = srcArr.length;
        for(let i=0;i<length;i++) {
            //取出pid=0的一级目录
            // console.log(srcArr[i].pid);
            if(srcArr[i].pid == '0') {
                //一级目录增加list属性，用于添加子目录
                srcArr[i].list = [];
                for(let j=0;j<length;j++) {
                    //取到一级目录的_id
                    if(srcArr[j].pid == srcArr[i]._id) {
                        srcArr[i].list.push(srcArr[j]);
                    }
                }

                resultArr.push(srcArr[i]);
            }
        }
        return resultArr;
    }
};

module.exports = Tool;
