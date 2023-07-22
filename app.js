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
const deliversRouter = require('./routes/deliver.route.js');
const viewRouter = require('./views/router');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const e = require('express');
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
  deliversRouter,
]);

let users = [];
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res || {}, next);
});

io.on('connection', async (socket) => {
  const req = socket.request;
  const accessToken = req.cookies.accessToken;

  if (!accessToken) return;
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_KEY);
    if (decoded.userId) {
      socket.data.userId = decoded.userId;
      socket.data.ownerId = 0;
    } else {
      socket.data.ownerId = decoded.ownerId;
      socket.data.userId = 0;
    }
  } catch {
    return;
  }
  console.log(`${socket.id}로 연결되었습니다.`);
  users.push(socket);
  console.log(socket.data.userId);
  socket.on('order-complete', (data) => {
    const ownerArr = users.filter((user) => user.data.ownerId === data.ownerId);

    ownerArr.forEach((owner) => {
      if (owner.id) io.to(owner.id).emit('order-complete', { order: data.order });
    });
  });

  socket.on('delivery-complete', (data) => {
    const { userId, storeName } = data;

    const userArr = users.filter((user) => user.data.userId === userId);
    console.log(userArr);
    userArr.forEach((user) => {
      io.to(user.id).emit('delivery-complete', { storeName });
    });
  });

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
