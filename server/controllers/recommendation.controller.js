const { Restaurant, Review } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

const getHotRecommendations = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { status: 1 },
      order: [['review_count', 'DESC']],
      limit: 10
    });

    success(res, restaurants.map(r => ({
      ...r.toJSON(),
      reason: '评论数量最多'
    })));
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getGoodRecommendations = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { status: 1, review_count: { [Op.gt]: 0 } },
      order: [['avg_score', 'DESC']],
      limit: 10
    });

    success(res, restaurants.map(r => ({
      ...r.toJSON(),
      reason: '评分高于大多数餐厅'
    })));
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getValueRecommendations = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: {
        status: 1,
        avg_score: { [Op.gte]: 4.0 },
        review_count: { [Op.gt]: 0 }
      },
      order: [['avg_price', 'ASC']],
      limit: 10
    });

    success(res, restaurants.map(r => ({
      ...r.toJSON(),
      reason: '高评分且价格实惠'
    })));
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getPersonalRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      // 未登录用户返回热门推荐
      return getHotRecommendations(req, res);
    }

    // 获取用户历史点评的餐厅类型偏好
    const userReviews = await Review.findAll({
      where: { user_id: userId, status: 'approved' },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['type']
      }]
    });

    if (userReviews.length === 0) {
      // 没有点评记录，返回热门推荐
      return getHotRecommendations(req, res);
    }

    // 统计用户偏好的餐厅类型
    const typeCount = {};
    userReviews.forEach(review => {
      const type = review.restaurant?.type;
      if (type) {
        typeCount[type] = (typeCount[type] || 0) + 1;
      }
    });

    // 获取用户评价过的餐厅ID
    const reviewedRestaurantIds = userReviews.map(r => r.restaurant_id);

    // 按偏好类型排序
    const preferredTypes = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);

    // 推荐用户偏好类型的高分餐厅（排除已评价的）
    const where = {
      status: 1,
      review_count: { [Op.gt]: 0 }
    };

    if (preferredTypes.length > 0) {
      where.type = { [Op.in]: preferredTypes };
    }

    if (reviewedRestaurantIds.length > 0) {
      where.id = { [Op.notIn]: reviewedRestaurantIds };
    }

    const restaurants = await Restaurant.findAll({
      where,
      order: [
        ['avg_score', 'DESC'],
        ['review_count', 'DESC']
      ],
      limit: 10
    });

    // 计算推荐分数
    const recommendations = restaurants.map(r => {
      const restaurant = r.toJSON();
      const score = restaurant.avg_score * 0.7 + Math.log(restaurant.review_count + 1) * 0.3;
      const typeMatch = preferredTypes.indexOf(restaurant.type);
      const reason = typeMatch === 0 ? '猜你喜欢' : typeMatch > 0 ? '你可能感兴趣' : '高评分推荐';

      return {
        ...restaurant,
        score: score.toFixed(2),
        reason
      };
    });

    // 按推荐分数排序
    recommendations.sort((a, b) => b.score - a.score);

    success(res, recommendations);
  } catch (err) {
    error(res, 500, err.message);
  }
};

module.exports = {
  getHotRecommendations,
  getGoodRecommendations,
  getValueRecommendations,
  getPersonalRecommendations
};
