const success = (res, data = null, message = 'success') => {
  res.json({
    code: 200,
    message,
    data
  });
};

const error = (res, code = 500, message = '服务器错误') => {
  res.status(code).json({
    code,
    message,
    data: null
  });
};

module.exports = { success, error };
