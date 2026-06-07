const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn }
  );
};

const register = async ({ student_no, nickname, college, password }) => {
  const existingUser = await User.findOne({ where: { student_no } });
  if (existingUser) {
    throw new Error('学号已存在');
  }

  const user = await User.create({
    student_no,
    nickname,
    college,
    password,
    role: 'student'
  });

  const token = generateToken(user);
  return { user, token };
};

const login = async ({ student_no, password }) => {
  const user = await User.findOne({ where: { student_no } });
  if (!user) {
    throw new Error('用户不存在');
  }

  if (user.status === 0) {
    throw new Error('账号已被禁用');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('密码错误');
  }

  const token = generateToken(user);
  return { user, token };
};

module.exports = { register, login, generateToken };
