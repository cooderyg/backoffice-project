const jwt = require('jsonwebtoken');
const { Users, Owners } = require('../models');

require('dotenv').config();
const env = process.env;

const authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access Token이 필요합니다.' });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_KEY);

    if (decodedAccessToken.hasOwnProperty('userId')) {
      // 유저
      const user = await Users.findOne({ where: { userId: decodedAccessToken.userId } });
      if (!user) {
        return res.status(401).json({ errorMessage: '유효한 사용자가 아닙니다.' });
      }
      res.locals.user = user;
    } else if (decodedAccessToken.hasOwnProperty('ownerId')) {
      // 오너
      const owner = await Owners.findOne({ where: { ownerId: decodedAccessToken.ownerId } });
      if (!owner) {
        return res.status(401).json({ errorMessage: '유효한 오너가 아닙니다.' });
      }
      res.locals.owner = owner;
    } else {
      // 노바디
      return res.status(401).json({ errorMessage: '유효하지 않은 Access Token입니다.' });
    }

    next();
  } catch (error) {
    console.log('🚀 ~ file: auth-middleware.js:16 ~ authMiddleware ~ error:', error);
    res.status(401).json({ message: '유효하지 않은 Access Token입니다.' });
  }
};

module.exports = authMiddleware;
