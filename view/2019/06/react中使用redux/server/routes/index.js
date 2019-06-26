const router = require('koa-router')()

router.post('/data', async (ctx, next) => {
  ctx.body = {
	  data: 'here'
  }
})


module.exports = router
