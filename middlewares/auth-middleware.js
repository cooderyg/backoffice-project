const jwt = require('jsonwebtoken');
const { Users, Owners } = require('../models');

require('dotenv').config();
const env = process.env;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.ACCESS_KEY, {
    expiresIn: '1h',
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_KEY, {
    expiresIn: '7d',
  });
};

const refreshTokenPair = async (res, payload) => {
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  res.cookie('accessToken', newAccessToken, { httpOnly: false });
  res.cookie('refreshToken', newRefreshToken, { httpOnly: false });
};

const authMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ errorMessage: 'Access Token이 필요합니다.' });
  }

  if (!refreshToken) {
    return res.status(401).json({ errorMessage: 'Refresh Token이 필요합니다.' });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_KEY);

    if (decodedAccessToken.hasOwnProperty('userId')) {
      // 유저
      const user = await Users.findOne({ where: { userId: decodedAccessToken.userId } });
      if (!user) {
        return res.status(401).json({ errorMessage: '유효한 사용자가 아닙니다.' });
      }

      if (!user.emailVerify) {
        return res.status(401).json({ errorMessage: '이메일 인증이 필요합니다.' });
      }

      try {
        jwt.verify(refreshToken, env.REFRESH_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const newPayload = { userId: user.userId };
          await refreshTokenPair(res, newPayload);

          res.locals.user = user;
          return next();
        }
      }

      try {
        jwt.verify(accessToken, env.ACCESS_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const newPayload = { userId: user.userId };
          await refreshTokenPair(res, newPayload);

          res.locals.user = user;
          return next();
        }
      }

      res.locals.user = user;
      next();
    } else if (decodedAccessToken.hasOwnProperty('ownerId')) {
      // 오너
      const owner = await Owners.findOne({ where: { ownerId: decodedAccessToken.ownerId } });
      if (!owner) {
        return res.status(401).json({ errorMessage: '유효한 오너가 아닙니다.' });
      }

      if (!owner.emailVerify) {
        return res.status(401).json({ errorMessage: '이메일 인증이 필요합니다.' });
      }

      try {
        jwt.verify(refreshToken, env.REFRESH_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const newPayload = { ownerId: owner.ownerId };
          await refreshTokenPair(res, newPayload);

          res.locals.owner = owner;
          return next();
        }
      }

      try {
        jwt.verify(accessToken, env.ACCESS_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const newPayload = { ownerId: owner.ownerId };
          await refreshTokenPair(res, newPayload);

          res.locals.owner = owner;
          return next();
        }
      }

      res.locals.owner = owner;
      next();
    } else {
      return res.status(401).json({ errorMessage: '유효하지 않은 Access Token입니다.' });
    }
  } catch (error) {
    console.log('🚀 ~ file: auth-middleware.js:16 ~ authMiddleware ~ error:', error);
    res.status(401).json({ errorMessage: '유효하지 않은 Access Token입니다.' });
  }
};

module.exports = authMiddleware;
