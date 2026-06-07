const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  restaurant_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected']]
    }
  },
  reply_content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reply_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reject_reason: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  create_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'review',
  timestamps: false
});

module.exports = Review;
