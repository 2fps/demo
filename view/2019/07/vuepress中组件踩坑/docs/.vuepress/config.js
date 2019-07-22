
module.exports = {
    title: 'Hello World',
    description: '2222',
    markdown: {
        lineNumbers: true,
        toc: { includeLevel: [1, 2] },
    },
    themeConfig: {
        lastUpdated: 'Last Updated',
        nav: [{
            text: 'Home',
            link: '/'
        }, {
            text: 'demo1',
            link: '/demo1/'
        }],
        sidebar: {
            "/demo1/": [
                ["/demo1/README.md", "demo1"]
            ],
        }
    }
}