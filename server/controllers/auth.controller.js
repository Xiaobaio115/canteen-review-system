const authService = require('../services/auth.service');
const { success, error } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { student_no, nickname, college, password } = req.body;

    if (!student_no || !nickname || !password) {
      return error(res, 400, '学号、昵称和密码不能为空');
    }

    const { user, token } = await authService.register({
      student_no,
      nickname,
      college,
      password
    });

    success(res, {
      userId: user.id,
      student_no: user.student_no,
      nickname: user.nickname,
      token
    }, '注册成功');
  } catch (err) {
    error(res, 400, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { student_no, password } = req.body;

    if (!student_no || !password) {
      return error(res, 400, '学号和密码不能为空');
    }

    const { user, token } = await authService.login({ student_no, password });

    success(res, {
      token,
      userInfo: {
        id: user.id,
        nickname: user.nickname,
        role: user.role
      }
    }, '登录成功');
  } catch (err) {
    error(res, 400, err.message);
  }
};

module.exports = { register, login };
