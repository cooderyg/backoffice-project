// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route.js');
const categoriesRouter = require('./routes/categories.route.js');
const menusRouter = require('./routes/menus.route.js');
const ordersRouter = require('./routes/orders.route.js');
const ownersRouter = require('./routes/owners.route.js');
const paymentsRouter = require('./routes/payments.route.js');
const reviewsRouter = require('./routes/reviews.route.js');
const storesRouter = require('./routes/stores.route.js');
const viewRouter = require('./views/router');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', [
  authRouter, //
  categoriesRouter,
  menusRouter,
  ordersRouter,
  ownersRouter,
  paymentsRouter,
  reviewsRouter,
  storesRouter,
]);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/static'));
app.use('/', viewRouter);
app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
