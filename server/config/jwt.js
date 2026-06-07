module.exports = {
  secret: process.env.JWT_SECRET || 'campus-food-review-secret-key-2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
