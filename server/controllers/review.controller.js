const { Review, Restaurant, User } = require('../models');
const { success, error } = require('../utils/response');
const { getPagination, paginateResponse } = require('../utils/pagination');

const create = async (req, res) => {
  try {
    const { restaurant_id, score, content } = req.body;

    if (!restaurant_id || !score || !content) {
      return error(res, 400, '餐厅ID、评分和内容不能为空');
    }

    if (score < 1 || score > 5) {
      return error(res, 400, '评分范围为1-5');
    }

    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return error(res, 404, '餐厅不存在');
    }

    // 检查用户是否已经对该餐厅提交过点评（24小时内）
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingReview = await Review.findOne({
      where: {
        user_id: req.user.id,
        restaurant_id,
        create_time: { [require('sequelize').Op.gte]: oneDayAgo }
      }
    });

    if (existingReview) {
      return error(res, 400, '您已经对该餐厅提交过点评，请24小时后再试');
    }

    const review = await Review.create({
      user_id: req.user.id,
      restaurant_id,
      score,
      content,
      status: 'pending',
      create_time: new Date()
    });

    success(res, { reviewId: review.id, status: review.status }, '点评发布成功，等待管理员审核');
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page, size, offset } = getPagination(req);

    const { count, rows } = await Review.findAndCountAll({
      where: { restaurant_id: restaurantId, status: 'approved' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'college']
      }],
      order: [['create_time', 'DESC']],
      limit: size,
      offset
    });

    success(res, paginateResponse(rows, count, page, size));
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getMyReviews = async (req, res) => {
  try {
    const { page, size, offset } = getPagination(req);

    const { count, rows } = await Review.findAndCountAll({
      where: { user_id: req.user.id },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['id', 'name', 'type']
      }],
      order: [['create_time', 'DESC']],
      limit: size,
      offset
    });

    success(res, paginateResponse(rows, count, page, size));
  } catch (err) {
    error(res, 500, err.message);
  }
};

module.exports = { create, getRestaurantReviews, getMyReviews };
