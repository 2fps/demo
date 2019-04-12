/** 
 * 遍历view文件夹下的内容，形成readme下的格式，最后由readme生成html
 * 
 */

let fs = require('fs');
let path = require('path');
let marked = require('marked');
let menu = {};

// 处理并生成menu
getNameAndPath('view', menu);
dealReadme(menu);


// 获取指定目录下的文件的信息
/**
 * 
 * @param {String} filePath 开始路径
 * @param {Object} menu     存放转化后的数据
 * @param {Number} cir      层级，控制检索到第几层
 */
function getNameAndPath(filePath, menu = {}, cir = 0) {
    let files = fs.readdirSync(filePath);

    cir++;

    for (let i = 0; i < files.length; ++i) {
        let filename = files[ i ],
            filedir = path.join(filePath, filename);

        // 控制遍历层级
        if (4 > cir) {
            // 这儿都是文件夹，仍需要遍历
            menu[ filename ] = {};
            getNameAndPath(filedir, menu[ filename ], cir);
        } else {
            // 一般内部有package.json的都需要独自启动服务器，所以，这种时候，不直接链接到他的index.html
            // 本地你启动http-server时，会默认进入该文件夹下的index.html，但是在github上只会进入文件夹中
            let needServer = fs.existsSync(filePath + '/package.json');

            // 替换 window 下的斜杠
            menu.path = filePath.replace(/\\/g, '/');
            menu.needServer = needServer;

            // 提前退出，没必要遍历
            break;
        }
    }
}

// 修改 readme
function dealReadme(menu) {
    let curPath = 'README.md',
        str = '';
    // 先删除 README
    if (fs.existsSync(curPath)) {
        fs.unlinkSync(curPath)
    }
    // 先获取通用readme头部信息
    str = fs.readFileSync('public/title.md');
    // 增加内容
    str += transPath(menu);
    // 写数据
    fs.writeFileSync(curPath, str);
    // 处理html
    createHTML(marked(str));
}

// 将menu转成md，此处要按时间倒序排
function transPath(menu) {
    let str = '';

    // 年份倒序
    Object.keys(menu).sort(function(y1, y2) {
        return y2 - y1;
    }).forEach(function(year) {
        str += `

## ${year}  `;
        // 月份倒序
        Object.keys(menu[ year ]).sort(function(m1, m2) {
            return m2 - m1;
        }).forEach(function(month) {
            str += `

### ${month}  `;

            for (var title in menu[ year ][ month ]) {
                let fix = menu[ year ][ month ][ title ].needServer ? '' : '/index.html';
                // 需要独自启服务的，链接到他的目录就行，
                // 不需要启服务的，链接到默认的index.html就行了
                str += `
+ [${title}](${menu[ year ][ month ][ title ].path + fix})，帮助信息查看：[README.md](${menu[ year ][ month ][ title ].path + '/README.md'})  `;
            }
        });
    });

    return str;
}

// 根据md生成html
function createHTML(html) {
    let curPath = 'index.html',
        str = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
${html}
</body>
</html>`;

    // 先删除 index.html
    if (fs.existsSync(curPath)) {
        fs.unlinkSync(curPath)
    }
    // 增加
    fs.writeFileSync(curPath, str);
}