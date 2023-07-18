const jwt = require('jsonwebtoken');
const { Users, Owners } = require('../models');

require('dotenv').config();
const env = process.env;

// 액세스 토큰 발급
const usergenerateAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, env.ACCESS_KEY, {
    expiresIn: '1h',
  });
};

// 리프레시 토큰 발급
const usergenerateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, env.REFRESH_KEY, {
    expiresIn: '7d',
  });
};

// 액세스 토큰 발급
const ownergenerateAccessToken = (ownerId) => {
  return jwt.sign({ ownerId: ownerId }, env.ACCESS_KEY, {
    expiresIn: '1h',
  });
};

// 리프레시 토큰 발급
const ownergenerateRefreshToken = (ownerId) => {
  return jwt.sign({ ownerId: ownerId }, env.REFRESH_KEY, {
    expiresIn: '7d',
  });
};

const authMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access Token이 필요합니다.' });
  }

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token이 필요합니다.' });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_KEY);

    if (decodedAccessToken.hasOwnProperty('userId')) {
      // 유저
      const user = await Users.findOne({ where: { userId: decodedAccessToken.userId } });
      if (!user) {
        return res.status(401).json({ errorMessage: '유효한 사용자가 아닙니다.' });
      }

      // 이메일 인증 확인
      if (!user.emailVerify) {
        return res.status(401).json({ errorMessage: '이메일 인증이 필요합니다.' });
      }

      // Case 2: Access Token과 Refresh Token 모두 만료된 경우
      try {
        jwt.verify(refreshToken, env.REFRESH_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const decodedRefreshToken = jwt.decode(refreshToken);
          const userId = decodedRefreshToken.userId;

          const newAccessToken = usergenerateAccessToken(userId);
          const newRefreshToken = usergenerateRefreshToken(userId);

          res.locals.user = user;

          return res
            .cookie('accessToken', newAccessToken, { httpOnly: true })
            .cookie('refreshToken', newRefreshToken, { httpOnly: true })
            .json({
              userId,
              newAccessToken,
              message: 'ACCESS TOKEN과 REFRESH TOKEN이 갱신되었습니다.',
            });
        }
      }

      // Case 3: Access Token은 만료됐지만 Refresh Token은 유효한 경우
      try {
        jwt.verify(req.cookies.accessToken, env.ACCESS_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const decodedRefreshToken = jwt.decode(refreshToken);
          const userId = decodedRefreshToken.userId;

          const newAccessToken = usergenerateAccessToken(userId);

          res.locals.user = user;

          return res.cookie('accessToken', newAccessToken, { httpOnly: true }).json({
            userId,
            newAccessToken,
            message: 'ACCESS TOKEN이 갱신되었습니다.',
          });
        }
      }

      // Case 4: Access Token과 Refresh Token 모두 유효한 경우
      const decodedAccessToken = jwt.decode(req.cookies.accessToken);
      const userId = decodedAccessToken.userId;

      res.locals.user = user;

      res.status(201).json({
        userId,
        accessToken,
        message: 'ACCESS TOKEN과 REFRESH TOKEN이 모두 유효합니다.',
      });
    } else if (decodedAccessToken.hasOwnProperty('ownerId')) {
      // 오너
      const owner = await Owners.findOne({ where: { ownerId: decodedAccessToken.ownerId } });
      if (!owner) {
        return res.status(401).json({ errorMessage: '유효한 오너가 아닙니다.' });
      }

      // 이메일 인증 확인
      if (!owner.emailVerify) {
        return res.status(401).json({ errorMessage: '이메일 인증이 필요합니다.' });
      }

      // Case 2: Access Token과 Refresh Token 모두 만료된 경우
      try {
        jwt.verify(refreshToken, env.REFRESH_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const decodedRefreshToken = jwt.decode(refreshToken);
          const ownerId = decodedRefreshToken.ownerId;

          const newAccessToken = ownergenerateAccessToken(ownerId);
          const newRefreshToken = ownergenerateRefreshToken(ownerId);

          res.locals.owner = owner;

          return res
            .cookie('accessToken', newAccessToken, { httpOnly: true })
            .cookie('refreshToken', newRefreshToken, { httpOnly: true })
            .json({
              ownerId,
              newAccessToken,
              message: 'ACCESS TOKEN과 REFRESH TOKEN이 갱신되었습니다.',
            });
        }
      }

      // Case 3: Access Token은 만료됐지만 Refresh Token은 유효한 경우
      try {
        jwt.verify(req.cookies.accessToken, env.ACCESS_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const decodedRefreshToken = jwt.decode(refreshToken);
          const ownerId = decodedRefreshToken.ownerId;

          const newAccessToken = ownergenerateAccessToken(ownerId);

          res.locals.owner = owner;

          return res.cookie('accessToken', newAccessToken, { httpOnly: true }).json({
            ownerId,
            newAccessToken,
            message: 'ACCESS TOKEN이 갱신되었습니다.',
          });
        }
      }

      // Case 4: Access Token과 Refresh Token 모두 유효한 경우
      if (refreshToken) {
        const decodedAccessToken = jwt.decode(req.cookies.accessToken);
        const ownerId = decodedAccessToken.ownerId;

        res.locals.owner = owner;

        res.status(201).json({
          ownerId,
          accessToken,
          message: 'ACCESS TOKEN과 REFRESH TOKEN이 모두 유효합니다.',
        });
      }
    } else {
      // 액세스 토큰 없음
      return res.status(401).json({ errorMessage: '유효하지 않은 Access Token입니다.' });
    }

    next();
  } catch (error) {
    console.log('🚀 ~ file: auth-middleware.js:16 ~ authMiddleware ~ error:', error);
    res.status(401).json({ message: '유효하지 않은 Access Token입니다.' });
  }
};

module.exports = authMiddleware;
