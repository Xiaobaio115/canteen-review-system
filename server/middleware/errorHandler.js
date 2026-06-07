const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      code: 400,
      message: err.errors.map(e => e.message).join(', '),
      data: null
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      code: 400,
      message: '数据已存在',
      data: null
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      code: 401,
      message: '无效的token',
      data: null
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      code: 401,
      message: 'token已过期',
      data: null
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器错误';

  res.status(statusCode).json({
    code: statusCode,
    message,
    data: null
  });
};

module.exports = errorHandler;
