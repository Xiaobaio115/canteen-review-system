const getPagination = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const size = Math.min(50, Math.max(1, parseInt(req.query.size) || 10));
  const offset = (page - 1) * size;

  return { page, size, offset };
};

const paginateResponse = (data, total, page, size) => {
  return {
    total,
    list: data,
    page,
    size,
    totalPages: Math.ceil(total / size)
  };
};

module.exports = { getPagination, paginateResponse };
