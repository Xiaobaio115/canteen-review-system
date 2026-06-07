const { Review, Restaurant, User } = require('../models');
const { success, error } = require('../utils/response');
const { getPagination, paginateResponse } = require('../utils/pagination');

const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { merchant_id: req.user.id, status: 1 }
    });
    success(res, restaurants);
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page, size, offset } = getPagination(req);

    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId, merchant_id: req.user.id }
    });

    if (!restaurant) {
      return error(res, 403, '无权访问该餐厅');
    }

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

const replyReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply_content } = req.body;

    if (!reply_content) {
      return error(res, 400, '回复内容不能为空');
    }

    const review = await Review.findByPk(reviewId, {
      include: [{ model: Restaurant, as: 'restaurant' }]
    });

    if (!review) {
      return error(res, 404, '点评不存在');
    }

    if (review.restaurant.merchant_id !== req.user.id) {
      return error(res, 403, '无权回复该点评');
    }

    review.reply_content = reply_content;
    review.reply_time = new Date();
    await review.save();

    success(res, null, '回复成功');
  } catch (err) {
    error(res, 500, err.message);
  }
};

const updateMyRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
      where: { id, merchant_id: req.user.id, status: 1 }
    });

    if (!restaurant) {
      return error(res, 403, '无权修改该餐厅');
    }

    const { name, address, type, avg_price, menu_info, image } = req.body;
    await restaurant.update({
      ...(name !== undefined && { name }),
      ...(address !== undefined && { address }),
      ...(type !== undefined && { type }),
      ...(avg_price !== undefined && { avg_price }),
      ...(menu_info !== undefined && { menu_info }),
      ...(image !== undefined && { image }),
      update_time: new Date()
    });

    success(res, restaurant, '餐厅信息更新成功');
  } catch (err) {
    error(res, 500, err.message);
  }
};

module.exports = { getMyRestaurants, getRestaurantReviews, replyReview, updateMyRestaurant };
