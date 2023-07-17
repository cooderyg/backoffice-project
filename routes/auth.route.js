const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const { Owners } = require('../models');
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

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { refreshToken, accessToken } = req.cookies;

    // Case 1: 처음 로그인하는 경우
    if (!refreshToken) {
      const user = await Users.findOne({ where: { email: email } });
      res.clearCookie('refreshToken');

      // 회원 유효성
      if (!user) {
        return res.status(401).json({ message: '닉네임이 존재하지 않습니다.' });
      }

      // 비밀번호 유효성
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(401).json({ message: '잘못된 비밀번호.' });
      }

      const newAccessToken = usergenerateAccessToken(user.userId);
      const newRefreshToken = usergenerateRefreshToken(user.userId);

      const userId = user.userId;

      return res
        .cookie('accessToken', newAccessToken, { httpOnly: true })
        .cookie('refreshToken', newRefreshToken, { httpOnly: true })
        .json({ userId, newAccessToken, message: '로그인되었습니다.' });
    }

    // Case 4: Access Token과 Refresh Token 모두 유효한 경우
    if (refreshToken) {
      const decodedAccessToken = jwt.decode(req.cookies.accessToken);
      const userId = decodedAccessToken.userId;
      console.log('5');
      res.status(201).json({
        userId,
        accessToken,
        message: 'ACCESS TOKEN과 REFRESH TOKEN이 모두 유효합니다.',
      });
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js:56 ~ router.post ~ error:', error);
    res.status(500).json({ message: '로그인 오류' });
  }
});

router.post('/owner/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { refreshToken, accessToken } = req.cookies;

    // Case 1: 처음 로그인하는 경우
    if (!refreshToken) {
      const owner = await Owners.findOne({ where: { email: email } });
      res.clearCookie('refreshToken');

      // 회원 유효성
      if (!owner) {
        return res.status(401).json({ message: '이메일이 존재하지 않습니다.' });
      }

      // 비밀번호 유효성
      const comparePassword = await bcrypt.compare(password, owner.password);

      if (!comparePassword) {
        return res.status(401).json({ message: '잘못된 비밀번호.' });
      }

      const newAccessToken = ownergenerateAccessToken(owner.ownerId);
      const newRefreshToken = ownergenerateRefreshToken(owner.ownerId);

      const ownerId = owner.ownerId;

      return res
        .cookie('accessToken', newAccessToken, { httpOnly: true })
        .cookie('refreshToken', newRefreshToken, { httpOnly: true })
        .json({ ownerId, newAccessToken, message: '로그인되었습니다.' });
    }

    // Case 4: Access Token과 Refresh Token 모두 유효한 경우
    if (refreshToken) {
      const decodedAccessToken = jwt.decode(req.cookies.accessToken);
      const ownerId = decodedAccessToken.ownerId;
      res.status(201).json({
        ownerId,
        accessToken,
        message: 'ACCESS TOKEN과 REFRESH TOKEN이 모두 유효합니다.',
      });
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js:56 ~ router.post ~ error:', error);
    res.status(500).json({ message: '로그인 오류' });
  }
});

// 유저 회원가입 API
router.post('/user/signup', async (req, res) => {
  const { email, userName, nickname, password, age, gender, address } = req.body;

  try {
    // 값이 비어있을 때
    if (!nickname || !password) {
      return res.status(401).json({ message: '닉네임과 비밀번호를 입력해주세요.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      email,
      userName,
      nickname,
      password: hashedPassword,
      age,
      gender,
      address,
    });

    res.status(201).json({ message: '회원가입 완료', newUser });
  } catch (error) {
    console.log('🚀 ~ file: users.js:45 ~ router.post ~ error:', error);
    res.status(500).json({ message: '회원가입 오류' });
  }
});

// 오너 회원가입 API
router.post('/owner/signup', async (req, res) => {
  const { email, password, point } = req.body;

  try {
    // 값이 비어있을 때
    if (!email || !password) {
      return res.status(401).json({ message: '닉네임과 비밀번호를 입력해주세요.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = await Owners.create({
      email,
      password: hashedPassword,
      point,
    });

    res.status(201).json({ message: '회원가입 완료', newOwner });
  } catch (error) {
    console.log('🚀 ~ file: users.js:45 ~ router.post ~ error:', error);
    res.status(500).json({ message: '회원가입 오류' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: '로그아웃되었습니다.' });
});

module.exports = router;
