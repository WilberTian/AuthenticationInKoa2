const Koa = require('koa');
const kjwt = require('koa-jwt');
const jwt = require('jsonwebtoken');

const app = new Koa();

const name = 'wilber';
const pwd = '123';
const role = 'admin';
const secret = 'jwt_secret';

app.use((ctx, next) => {
    return next().catch((err) => {
        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
});

// Unprotected middleware
app.use((ctx, next) => {
    if (ctx.url.match(/^\/public/)) {
        ctx.body = 'unprotected resource\n';
    } else {
        return next();
    }
});

// login
app.use((ctx, next) => {
    if (ctx.url.match(/^\/login/)) {
        if (ctx.query.name === name && ctx.query.pwd === pwd) {
            const token = jwt.sign({
                name,
                pwd,
                role
            }, secret);
            ctx.body = token;
        } else {
            return next();
        }
    } else {
        return next();
    }
});

// Middleware below this line is only reached if JWT token is valid
app.use(kjwt({ secret: secret, getToken: ctx => ctx.query.token }));

// Protected middleware
app.use((ctx) => {
    if (ctx.url.match(/^\/api/)) {
        ctx.body = ctx.state.user.name + ' is visiting the protected resource\n';
    }
});

app.listen(9999);
console.log('listening on port 9999');