// 不推荐，仅当例子
/* Array.prototype.forEach = async function(fn) {
    let len = this.length;

    for (let i = 0; i < len; ++i) {
        await fn.call(this[i], i);
    }
}; */

(async () => {
    await sleep();
    console.log('start');
    
    // [0, 1, 2].forEach(async () => {
    //     await sleep();
    //     console.log(1111);
    // });
    for (let i = 0; i < 3; ++i) {
        await sleep();
        console.log(1111);
    }
    console.log('finish');
})();

async function sleep(time = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}


