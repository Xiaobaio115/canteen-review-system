const { success, error } = require('../utils/response');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, 400, '请选择要上传的图片');
    }
    const url = `/uploads/restaurants/${req.file.filename}`;
    success(res, { url }, '图片上传成功');
  } catch (err) {
    error(res, 500, err.message);
  }
};

module.exports = { uploadImage };
