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
const filesRouter = require('./routes/files.route.js');
const usersRouter = require('./routes/users.route.js');
const viewRouter = require('./views/router');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', [
  authRouter, //
  categoriesRouter,
  menusRouter,
  ordersRouter,
  ownersRouter,
  usersRouter,
  filesRouter,
  paymentsRouter,
  reviewsRouter,
  storesRouter,
]);

let users = [];
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res || {}, next);
});
io.on('connection', async (socket) => {
  const req = socket.request;
  const accessToken = req.cookies.accessToken;
  if (!accessToken) next(new Error('미로그인입니다.'));
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_KEY);
    decoded.userId
      ? (socket.data.userId = decoded.userId)
      : (socket.data.ownerId = decoded.ownerId);
  } catch {
    next(new Error('유효하지 않은 토큰입니다.'));
  }

  users.push(socket);

  socket.on('disconnect', () => {
    users.splice(users.indexOf(socket), 1);
  });
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/static'));
app.use('/', viewRouter);
server.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
