const { success, error } = require('../utils/response');

const getMe = async (req, res) => {
  try {
    success(res, req.user.toJSON());
  } catch (err) {
    error(res, 500, err.message);
  }
};

const updateMe = async (req, res) => {
  try {
    const { nickname, college } = req.body;
    const user = req.user;

    if (nickname) user.nickname = nickname;
    if (college !== undefined) user.college = college;

    await user.save();
    success(res, user.toJSON(), '更新成功');
  } catch (err) {
    error(res, 500, err.message);
  }
};

module.exports = { getMe, updateMe };
