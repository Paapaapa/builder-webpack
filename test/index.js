const path = require('path');

// 变更 Node.js 进程的当前工作目录
process.chdir(path.resolve(__dirname, 'smoke/template'));

describe('builder-webpack test case',()=>{
    require('./unit/webpack.base.test');
})