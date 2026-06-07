const { Review, Restaurant, User } = require('../models');
const { success, error } = require('../utils/response');
const { getPagination, paginateResponse } = require('../utils/pagination');
const { sequelize } = require('../models');

const getPendingReviews = async (req, res) => {
  try {
    const { page, size, offset } = getPagination(req);

    const { count, rows } = await Review.findAndCountAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'nickname', 'student_no'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
      ],
      order: [['create_time', 'DESC']],
      limit: size,
      offset
    });

    success(res, paginateResponse(rows, count, page, size));
  } catch (err) {
    error(res, 500, err.message);
  }
};

const auditReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { reviewId } = req.params;
    const { status, reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      await transaction.rollback();
      return error(res, 400, '审核状态无效');
    }

    const review = await Review.findByPk(reviewId, { transaction });
    if (!review) {
      await transaction.rollback();
      return error(res, 404, '点评不存在');
    }

    review.status = status;
    if (status === 'rejected' && reason) {
      review.reject_reason = reason;
    }
    await review.save({ transaction });

    if (status === 'approved') {
      const restaurant = await Restaurant.findByPk(review.restaurant_id, { transaction });
      if (restaurant) {
        const result = await Review.findOne({
          where: { restaurant_id: review.restaurant_id, status: 'approved' },
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            [sequelize.fn('AVG', sequelize.col('score')), 'avgScore']
          ],
          transaction
        });

        restaurant.review_count = result.getDataValue('count');
        restaurant.avg_score = parseFloat(result.getDataValue('avgScore') || 0).toFixed(2);
        restaurant.update_time = new Date();
        await restaurant.save({ transaction });
      }
    }

    await transaction.commit();
    success(res, null, '审核完成');
  } catch (err) {
    await transaction.rollback();
    error(res, 500, err.message);
  }
};

const getStatistics = async (req, res) => {
  try {
    const [userCount, restaurantCount, reviewCount, pendingReviewCount] = await Promise.all([
      User.count(),
      Restaurant.count({ where: { status: 1 } }),
      Review.count(),
      Review.count({ where: { status: 'pending' } })
    ]);

    success(res, { userCount, restaurantCount, reviewCount, pendingReviewCount });
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const { page, size, offset } = getPagination(req);
    const { role } = req.query;

    const where = {};
    if (role) where.role = role;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['create_time', 'DESC']],
      limit: size,
      offset
    });

    success(res, paginateResponse(rows, count, page, size));
  } catch (err) {
    error(res, 500, err.message);
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return error(res, 404, '用户不存在');
    }

    user.status = action === 'disable' ? 0 : 1;
    await user.save();

    success(res, null, action === 'disable' ? '用户已禁用' : '用户已恢复');
  } catch (err) {
    error(res, 500, err.message);
  }
};

module.exports = { getPendingReviews, auditReview, getStatistics, getUsers, toggleUserStatus };
