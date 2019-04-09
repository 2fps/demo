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

    files.forEach(function(filename) {
        let filedir = path.join(filePath, filename);

        if (4 > cir) {
            // 检索层级
            menu[ filename ] = {};
            getNameAndPath(filedir, menu[ filename ], cir);
        } else {
            menu.path = filePath.replace(/\\/g, '/');

            return;
        }
    });
}

// 修改 readme
function dealReadme(menu) {
    let curPath = 'README.md',
        str = '';
    // 先删除 README
    if (fs.existsSync(curPath)) {
        fs.unlinkSync(curPath)
    }
    // 先获取readme头部信息
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
        Object.keys(menu[ year ]).sort(function(y1, y2) {
            return y2 - y1;
        }).forEach(function(month) {
            str += `
### ${month}  `;

            for (var title in menu[ year ][ month ]) {
                str += `
+ [${title}](${menu[ year ][ month ][ title ].path + '/index.html'})，README查看：[README.md](${menu[ year ][ month ][ title ].path + '/README.md'})  `;
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
<html lang="en">
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