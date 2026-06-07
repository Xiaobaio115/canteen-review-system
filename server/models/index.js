const User = require('./User');
const Restaurant = require('./Restaurant');
const Review = require('./Review');

// Define associations
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Restaurant.hasMany(Review, { foreignKey: 'restaurant_id', as: 'reviews' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });

User.hasMany(Restaurant, { foreignKey: 'merchant_id', as: 'restaurants' });
Restaurant.belongsTo(User, { foreignKey: 'merchant_id', as: 'merchant' });

module.exports = {
  User,
  Restaurant,
  Review,
  sequelize: require('../config/database').sequelize
};
