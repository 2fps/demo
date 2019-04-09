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
function getNameAndPath(filePath, menu = {}) {
    let files = fs.readdirSync(filePath);

    files.forEach(function(filename) {
        let filedir = path.join(filePath, filename);

        let stats = fs.statSync(filedir);
        let isFile = stats.isFile();//是文件
        let isDir = stats.isDirectory();//是文件夹

        if (isDir) {
            menu[ filename ] = {};
            getNameAndPath(filedir, menu[ filename ]);
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

// 将menu转成md
function transPath(menu) {
    let str = '';

    for (var title in menu) {
        str += `
## ${title}  `;

        for (var sub in menu[ title ]) {
            str += `
### ${sub}  `;

            for (var head in menu[ title ][ sub ]) {
                str += `
+ [${head}](${menu[ title ][ sub ][ head ].path})，README查看：[README.md](${menu[ title ][ sub ][ head ].path + '/README.md'})  `;
            }
        }
    }

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