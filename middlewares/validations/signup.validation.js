const Joi = require('joi');

const emailPattern =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
const nicknamePattern = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/;

// 유저용 스키마
const userSchema = Joi.object().keys({
  email: Joi.string().min(3).max(30).pattern(new RegExp(emailPattern)).required(),
  password: Joi.string().min(4).max(20).required(),
  nickname: Joi.string().min(2).pattern(new RegExp(nicknamePattern)).required(),
  userName: Joi.string().min(2).required(),
  age: Joi.number().min(1).required(),
  gender: Joi.required(),
  address: Joi.required(),
  phoneNumber: Joi.required(),
});

// 오너용 스키마
const ownerSchema = Joi.object().keys({
  email: Joi.string().min(3).max(30).pattern(new RegExp(emailPattern)).required(),
  password: Joi.string().min(4).max(20).required(),
});

module.exports = async (req, res, next) => {
  try {
    // 경로에서 /owner/를 포함하면 오너용 스키마로 유효성 검사
    if (req.url.includes('/owner/')) {
      await ownerSchema.validateAsync(req.body);
    } else {
      await userSchema.validateAsync(req.body);
    }
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  next();
};
