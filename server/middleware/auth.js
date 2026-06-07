const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未登录或token无效',
        data: null
      });
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findByPk(decoded.id);

    if (!user || user.status === 0) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在或已被禁用',
        data: null
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: 'token无效或已过期',
      data: null
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, secret);
      const user = await User.findByPk(decoded.id);
      if (user && user.status === 1) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore auth errors for optional auth
  }
  next();
};

module.exports = { auth, optionalAuth };
