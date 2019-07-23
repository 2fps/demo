
module.exports = {
    title: '11',
    description: '2222',
    themeConfig: {
        nav: [{
            text: 'Home',
            link: '/'
        }, {
            text: 'demo1',
            link: '/demo1/'
        }],
        sidebar: {
            "/demo1/": [
                ["/demo1/", "demo1"],   // not ["/demo1/README.md", "demo1"]
                ["/demo1/加法/加法.md", "加法.md"],
            ],
        }
    }
}