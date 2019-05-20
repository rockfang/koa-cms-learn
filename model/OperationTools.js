const md5 = require('md5');

const Tool = {
    md5: function (src) {
       return md5(src);
    }
};

module.exports = Tool;
