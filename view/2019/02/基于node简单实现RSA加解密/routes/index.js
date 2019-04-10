const router = require('koa-router')();
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});
// 查看 https://github.com/rzcoder/node-rsa/issues/91
key.setOptions({encryptionScheme: 'pkcs1'});  // 必须加上，加密方式问题。

router.get('/', async (ctx, next) => {
  await ctx.render('index.html')
});

router.get('/publicKey', async (ctx, next) => {
  // 获取公私钥
  var publicDer = key.exportKey('public');
  var privateDer = key.exportKey('private');
  console.log('公钥:',publicDer);
  console.log('私钥:',privateDer);

  ctx.body = publicDer;
});

router.post('/decryption', async (ctx, next) => {
  // 对加密数据进行解密
  var keyValue = JSON.parse(ctx.request.body).value;
  const decrypted = key.decrypt(keyValue, 'utf8');
  console.log('decrypted: ', decrypted);

  ctx.body = decrypted ;
});

module.exports = router;
