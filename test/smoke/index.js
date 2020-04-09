const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const Mocha=require('mocha');
const colors=require('colors');

const mocha =new Mocha({
    timeout:'10000ms',
});

// 变更 Node.js 进程的当前工作目录
process.chdir(path.resolve(__dirname, 'template'));

rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod');

    webpack(prodConfig, (err, stats) => {
        if (err) {
            console.log(error);
            process.exit(2);
        }

        console.log(stats.toString({
            colors: true,
            modules: false, // Tells stats whether to add information about the built modules.
            children: false,// Tells stats whether to add information about the children.
        }));

        console.log(colors.blue('Webpack build successfully,now start to test generated files···'));

        mocha.addFile(path.join(__dirname, 'html-test.js'));
        mocha.addFile(path.join(__dirname, 'css-js-test.js'));

        mocha.run();
    })
});

