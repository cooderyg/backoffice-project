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

      res.locals.user = user;
      return next();
    } else if (decodedAccessToken.hasOwnProperty('ownerId')) {
      // 오너
      const owner = await Owners.findOne({ where: { ownerId: decodedAccessToken.ownerId } });
      if (!owner) {
        return res.status(401).json({ errorMessage: '유효한 오너가 아닙니다.' });
      }

      if (!owner.emailVerify) {
        return res.status(401).json({ errorMessage: '이메일 인증이 필요합니다.' });
      }

      res.locals.owner = owner;
      return next();
    } else {
      return res.status(401).json({ errorMessage: '유효하지 않은 Access Token입니다.' });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // 액세스 토큰 만료
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, env.REFRESH_KEY);

        if (decodedRefreshToken.hasOwnProperty('userId')) {
          const newPayload = { userId: decodedRefreshToken.userId };
          const user = await Users.findOne({ where: { userId: decodedRefreshToken.userId } });
          res.locals.user = user;
          await refreshTokenPair(res, newPayload);
        } else if (decodedRefreshToken.hasOwnProperty('ownerId')) {
          const newPayload = { ownerId: decodedRefreshToken.ownerId };
          const owner = await Owners.findOne({ where: { ownerId: decodedRefreshToken.ownerId } });
          res.locals.owner = owner;
          await refreshTokenPair(res, newPayload);
        }

        return next();
      } catch (refreshError) {
        console.log(
          '🚀 ~ file: auth-middleware.js:54 ~ authMiddleware ~ refreshError:',
          refreshError,
        );
        res.locals.user = null;
        res.locals.owner = null;

        res.clearCookie('accessToken', { httpOnly: true });
        res.clearCookie('refreshToken', { httpOnly: true });
        return res.status(401).json({ errorMessage: '재로그인이 필요합니다.' });
      }
    }
  }
};

module.exports = authMiddleware;
