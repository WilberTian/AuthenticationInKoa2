const koa = require('koa');
const app = new koa();

app.keys = ['some secret hurr'];

app.use(async (ctx, next) => {
	if (ctx.path === '/') {
		ctx.body = 'Hello World';

    	ctx.cookies.set('name', 'wilber', { signed: true });
	} else if (ctx.path === '/cookie') {
		ctx.body = 'user name from cookie is: ' + ctx.cookies.get('name');
	} else {
		ctx.body = '404';
	}
    
});

app.listen(9999);
console.log('listening on port 9999');