if (typeof window === 'undefined') {
    global.window = {};
}

const express = require('express');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
// TODO ssr读取无效，值为undefined
console.log(renderToString(SSR));
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');
const data = require('./data.json');

// 设置shell命令窗口主题
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

const server = port => {
    const app = express();

    app.use(express.static('dist'));
    app.get('/search', (req, res) => {
        console.log('at /search···')

        res.status(200).send(renderMarkup(renderToString(SSR)));
    });

    app.listen(port, () => {
        console.log(colors.info('Server is running on port: %s'), port);
        console.log(colors.info('Serve at: '), colors.info.underline(`http://localhost:${port}`));
    });
}

// html模板
// const renderMarkup = str => {
//     return `<!DOCTYPE html>
//     <html lang="zh-cn">
//     <head>
//       <meta charset="UTF-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta name="viewport" content="width=device-width, initial-scale=1">
//       <title>webpack-demo-search-page</title>
//     </head>
//     <body>
//       <div id="root">${str}</div>
//     </body>
//     </html>`
// }

const renderMarkup = str => {
    const dataStr = JSON.stringify(data);
    return template.replace('<!--HTML_PLACEHOLDER-->', str)
        .replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window._initial_data=${dataStr}</script>`)
}

server(process.env.PORT || 3000);