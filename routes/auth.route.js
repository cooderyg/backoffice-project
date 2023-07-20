const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const { Owners } = require('../models');
const nodemailer = require('nodemailer');
const ValidationMiddleware = require('../middlewares/validations/signup.validation');

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

// 랜덤한 6자리 숫자 생성
const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: true,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: env.EMAIL_FROM,
      to: email,
      subject: '이메일 인증',
      html: `<h1>이메일 인증코드: ${verificationCode}</h1>`,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log('🚀 ~ file: auth.route.js ~ sendEmail ~ error', error);
    return false;
  }
};

router.post('/user/signup', ValidationMiddleware, async (req, res) => {
  const { email, userName, nickname, password, age, gender, address, phoneNumber } = req.body;

  try {
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 랜덤한 6자리 숫자 생성 (인증 코드)
    const verificationCode = generateRandomCode();

    // 유저 생성
    const newUser = await Users.create({
      email,
      userName,
      nickname,
      password: hashedPassword,
      age,
      gender,
      address,
      phoneNumber,
      emailVerify: false,
    });

    // 이메일 전송
    // const verifyUrl = `${env.FRONTEND_URL}/verify`;
    const isEmailSent = await sendEmail(email, verificationCode);
    if (!isEmailSent) {
      return res.status(500).json({ message: '이메일 전송에 실패했습니다.' });
    }

    res
      .status(201)
      .cookie('email', email, { httpOnly: true })
      .cookie('verificationCode', verificationCode, { httpOnly: true })
      .json({ message: '회원가입이 완료되었습니다.', newUser });
  } catch (error) {
    console.log('🚀 ~ file: auth.route.js:100 ~ router.post ~ error:', error);

    res.status(500).json({ message: '회원가입 도중 오류가 발생했습니다.' });
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { refreshToken, accessToken } = req.cookies;

    // Case 1: 처음 로그인하는 경우
    if (!refreshToken) {
      const user = await Users.findOne({ where: { email: email } });
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      // 회원 유효성
      if (!user) {
        return res.status(401).json({ message: '닉네임이 존재하지 않습니다.' });
      }

      // 비밀번호 유효성
      const comparePassword = await bcrypt.compare(password.toString(), user.password);

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

    // Case 2: Access Token과 Refresh Token 모두 만료된 경우
    try {
      jwt.verify(refreshToken, env.REFRESH_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const userId = decodedRefreshToken.userId;

        const newAccessToken = usergenerateAccessToken(userId);
        const newRefreshToken = usergenerateRefreshToken(userId);

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

        return res.cookie('accessToken', newAccessToken, { httpOnly: true }).json({
          userId,
          newAccessToken,
          message: 'ACCESS TOKEN이 갱신되었습니다.',
        });
      }
    }

    // Case 4: Access Token과 Refresh Token 모두 유효한 경우
    if (refreshToken) {
      const decodedAccessToken = jwt.decode(req.cookies.accessToken);
      const userId = decodedAccessToken.userId;
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

// 오너 회원가입 API
router.post('/owner/signup', ValidationMiddleware, async (req, res) => {
  const { email, password } = req.body;

  try {
    // 값이 비어있을 때
    if (!email || !password) {
      return res.status(401).json({ message: '닉네임과 비밀번호를 입력해주세요.' });
    }

    const existingOwner = await Owners.findOne({ where: { email } });

    if (existingOwner) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 랜덤한 6자리 숫자 생성 (인증 코드)
    const verificationCode = generateRandomCode();

    const newOwner = await Owners.create({
      email,
      password: hashedPassword,
      point: 0,
      emailVerify: false,
    });

    // 이메일 전송
    const isEmailSent = await sendEmail(email, verificationCode);
    if (!isEmailSent) {
      return res.status(500).json({ message: '이메일 전송에 실패했습니다.' });
    }

    res
      .status(201)
      .cookie('email', email, { httpOnly: true })
      .cookie('verificationCode', verificationCode, { httpOnly: true })
      .json({ message: '회원가입 완료', newOwner });
  } catch (error) {
    console.log('🚀 ~ file: users.js:45 ~ router.post ~ error:', error);
    res.status(500).json({ message: '회원가입 오류' });
  }
});

router.post('/owner/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { refreshToken, accessToken } = req.cookies;

    // Case 1: 처음 로그인하는 경우
    if (!refreshToken) {
      const owner = await Owners.findOne({ where: { email: email } });

      // 회원 유효성
      if (!owner) {
        return res.status(401).json({ message: '이메일이 존재하지 않습니다.' });
      }

      // 비밀번호 유효성
      const comparePassword = await bcrypt.compare(password.toString(), owner.password);

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

    // Case 2: Access Token과 Refresh Token 모두 만료된 경우
    try {
      jwt.verify(refreshToken, env.REFRESH_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const ownerId = decodedRefreshToken.ownerId;

        const newAccessToken = ownergenerateAccessToken(ownerId);
        const newRefreshToken = ownergenerateRefreshToken(ownerId);

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

router.post('/user/verify', async (req, res) => {
  const { verificationCode } = req.body;
  const email = req.cookies.email;
  const cookieverificationCode = req.cookies.verificationCode;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 인증 코드 검증
    if (user.emailVerify) {
      return res.status(400).json({ message: '이미 인증된 이메일입니다.' });
    }

    if (verificationCode !== cookieverificationCode) {
      return res.status(400).json({ message: '인증 코드가 일치하지 않습니다.' });
    }

    // 이메일 인증 완료 처리
    await Users.update({ emailVerify: true }, { where: { email } });

    res.clearCookie('email');
    res.clearCookie('verificationCode');

    res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
  } catch (error) {
    console.log('🚀 ~ file: auth.route.js:131 ~ router.post ~ error:', error);

    res.status(500).json({ message: '이메일 인증 도중 오류가 발생했습니다.' });
  }
});

router.post('/owner/verify', async (req, res) => {
  const { verificationCode } = req.body;
  const email = req.cookies.email;
  const cookieverificationCode = req.cookies.verificationCode;

  try {
    const owner = await Owners.findOne({ where: { email } });

    if (!owner) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 인증 코드 검증
    if (owner.emailVerify) {
      return res.status(400).json({ message: '이미 인증된 이메일입니다.' });
    }

    if (verificationCode !== cookieverificationCode) {
      return res.status(400).json({ message: '인증 코드가 일치하지 않습니다.' });
    }

    // 이메일 인증 완료 처리
    await Owners.update({ emailVerify: true }, { where: { email } });

    res.clearCookie('email');
    res.clearCookie('verificationCode');

    res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
  } catch (error) {
    console.log('🚀 ~ file: auth.route.js:131 ~ router.post ~ error:', error);

    res.status(500).json({ message: '이메일 인증 도중 오류가 발생했습니다.' });
  }
});

router.post('/logout', (req, res) => {
  res.locals.user = null;
  res.locals.owner = null;

  res.clearCookie('accessToken', { httpOnly: true });
  res.clearCookie('refreshToken', { httpOnly: true });
  res.json({ message: '로그아웃되었습니다.' });
});

module.exports = router;
