const { Restaurant, Review, User, sequelize } = require('../models');
const { success, error } = require('../utils/response');
const { getPagination, paginateResponse } = require('../utils/pagination');
const { Op } = require('sequelize');

const getList = async (req, res) => {
  try {
    const { keyword, type, minPrice, maxPrice, sort } = req.query;
    const { page, size, offset } = getPagination(req);

    const where = { status: 1 };
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }
    if (type) {
      where.type = type;
    }
    if (minPrice || maxPrice) {
      where.avg_price = {};
      if (minPrice) where.avg_price[Op.gte] = minPrice;
      if (maxPrice) where.avg_price[Op.lte] = maxPrice;
    }

    let order = [['create_time', 'DESC']];
    if (sort === 'score') order = [['avg_score', 'DESC']];
    if (sort === 'hot') order = [['review_count', 'DESC']];
    if (sort === 'price') order = [['avg_price', 'ASC']];

    const { count, rows } = await Restaurant.findAndCountAll({
      where,
      order,
      limit: size,
      offset
    });

    success(res, paginateResponse(rows, count, page, size));
  } catch (err) {
    error(res, 500, err.message);
  }
};

const getDetail = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [{
        model: Review,
        as: 'reviews',
        where: { status: 'approved' },
        required: false,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'college']
        }]
      }]
    });

    if (!restaurant) {
      return error(res, 404, '餐厅不存在');
    }

    success(res, restaurant);
  } catch (err) {
    error(res, 500, err.message);
  }
};

const create = async (req, res) => {
  try {
    const { name, address, type, avg_price, menu_info, merchant_id, image } = req.body;

    if (!name || !address || !type) {
      return error(res, 400, '餐厅名称、地址和类型不能为空');
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      type,
      avg_price: avg_price || 0,
      menu_info,
      merchant_id,
      image,
      create_time: new Date(),
      update_time: new Date()
    });

    success(res, restaurant, '餐厅创建成功');
  } catch (err) {
    error(res, 500, err.message);
  }
};

const update = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) {
      return error(res, 404, '餐厅不存在');
    }

    const { name, address, type, avg_price, menu_info, image } = req.body;
    if (name) restaurant.name = name;
    if (address) restaurant.address = address;
    if (type) restaurant.type = type;
    if (avg_price !== undefined) restaurant.avg_price = avg_price;
    if (menu_info !== undefined) restaurant.menu_info = menu_info;
    if (image !== undefined) restaurant.image = image;
    restaurant.update_time = new Date();

    await restaurant.save();
    success(res, restaurant, '餐厅更新成功');
  } catch (err) {
    error(res, 500, err.message);
  }
};

const remove = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, { transaction });
    if (!restaurant) {
      await transaction.rollback();
      return error(res, 404, '餐厅不存在');
    }

    // 软删除餐厅
    restaurant.status = 0;
    await restaurant.save({ transaction });

    // 将关联的待审核评论标记为已拒绝
    await Review.update(
      { status: 'rejected' },
      {
        where: {
          restaurant_id: req.params.id,
          status: 'pending'
        },
        transaction
      }
    );

    await transaction.commit();
    success(res, null, '餐厅已删除');
  } catch (err) {
    await transaction.rollback();
    error(res, 500, err.message);
  }
};

module.exports = { getList, getDetail, create, update, remove };
