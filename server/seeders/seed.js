require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sequelize, User, Restaurant, Review } = require('../models');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create users
    const users = await User.bulkCreate([
      { student_no: '20240001', nickname: '小明', college: '计算机学院', password: '123456', role: 'student', status: 1, create_time: new Date() },
      { student_no: '20240002', nickname: '小红', college: '外语学院', password: '123456', role: 'student', status: 1, create_time: new Date() },
      { student_no: '20240003', nickname: '小刚', college: '数学学院', password: '123456', role: 'student', status: 1, create_time: new Date() },
      { student_no: 'M001', nickname: '食堂张老板', college: null, password: '123456', role: 'merchant', status: 1, create_time: new Date() },
      { student_no: 'M002', nickname: '奶茶店李老板', college: null, password: '123456', role: 'merchant', status: 1, create_time: new Date() },
      { student_no: 'ADMIN001', nickname: '管理员', college: null, password: '123456', role: 'admin', status: 1, create_time: new Date() }
    ], { individualHooks: true });
    console.log('Users created');

    // Create restaurants
    const restaurants = await Restaurant.bulkCreate([
      { name: '第一食堂', address: '校园东区1号楼旁', type: '食堂', avg_price: 12, menu_info: '早中晚餐，提供各类家常菜', merchant_id: users[3].id, avg_score: 4.5, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() },
      { name: '第二食堂', address: '校园西区图书馆旁', type: '食堂', avg_price: 10, menu_info: '早中晚餐，面食为主', merchant_id: users[3].id, avg_score: 4.2, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() },
      { name: '校园麻辣烫', address: '校园南门商业街', type: '小吃', avg_price: 18, menu_info: '麻辣烫、冒菜、凉皮', merchant_id: users[4].id, avg_score: 4.8, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() },
      { name: '学苑奶茶', address: '校园北门对面', type: '奶茶', avg_price: 12, menu_info: '各类奶茶、果茶、咖啡', merchant_id: users[4].id, avg_score: 4.6, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() },
      { name: '老王面馆', address: '校园东门商业街', type: '面馆', avg_price: 15, menu_info: '牛肉面、炸酱面、凉面', merchant_id: null, avg_score: 4.3, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() },
      { name: '校园快餐', address: '校园中心广场', type: '快餐', avg_price: 15, menu_info: '各类套餐、炒饭、盖浇饭', merchant_id: null, avg_score: 4.0, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() },
      { name: '甜蜜烘焙', address: '校园南门商业街', type: '甜品', avg_price: 20, menu_info: '蛋糕、面包、甜点', merchant_id: null, avg_score: 4.7, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() },
      { name: '校园烧烤', address: '校园北门夜市', type: '烧烤', avg_price: 30, menu_info: '各类烧烤、烤鱼', merchant_id: null, avg_score: 4.4, review_count: 0, status: 1, create_time: new Date(), update_time: new Date() }
    ]);
    console.log('Restaurants created');

    // Create reviews
    const reviews = await Review.bulkCreate([
      { user_id: users[0].id, restaurant_id: restaurants[0].id, score: 5, content: '饭菜味道很好，价格实惠，推荐红烧肉！', status: 'approved', create_time: new Date() },
      { user_id: users[1].id, restaurant_id: restaurants[0].id, score: 4, content: '环境不错，就是高峰期人太多了。', status: 'approved', create_time: new Date() },
      { user_id: users[2].id, restaurant_id: restaurants[0].id, score: 5, content: '性价比很高，每天都在这里吃。', status: 'approved', create_time: new Date() },
      { user_id: users[0].id, restaurant_id: restaurants[1].id, score: 4, content: '面条很劲道，汤底也好喝。', status: 'approved', create_time: new Date() },
      { user_id: users[1].id, restaurant_id: restaurants[1].id, score: 4, content: '早餐种类丰富，推荐豆浆油条。', status: 'approved', create_time: new Date() },
      { user_id: users[0].id, restaurant_id: restaurants[2].id, score: 5, content: '麻辣烫超级好吃，量大实惠！', status: 'approved', create_time: new Date() },
      { user_id: users[2].id, restaurant_id: restaurants[2].id, score: 5, content: '每次路过都要买一份，强烈推荐。', status: 'approved', create_time: new Date() },
      { user_id: users[1].id, restaurant_id: restaurants[3].id, score: 5, content: '奶茶很好喝，环境也适合学习。', status: 'approved', create_time: new Date() },
      { user_id: users[0].id, restaurant_id: restaurants[3].id, score: 4, content: '价格适中，味道不错。', status: 'approved', create_time: new Date() },
      { user_id: users[2].id, restaurant_id: restaurants[4].id, score: 4, content: '牛肉面很正宗，分量足。', status: 'approved', create_time: new Date() },
      { user_id: users[0].id, restaurant_id: restaurants[5].id, score: 4, content: '快餐方便快捷，适合赶时间的时候吃。', status: 'approved', create_time: new Date() },
      { user_id: users[1].id, restaurant_id: restaurants[6].id, score: 5, content: '蛋糕很新鲜，甜度适中。', status: 'approved', create_time: new Date() },
      { user_id: users[2].id, restaurant_id: restaurants[7].id, score: 4, content: '烧烤味道不错，就是价格稍贵。', status: 'approved', create_time: new Date() },
      { user_id: users[0].id, restaurant_id: restaurants[0].id, score: 3, content: '今天红烧肉有点咸，希望改进。', status: 'pending', create_time: new Date() },
      { user_id: users[1].id, restaurant_id: restaurants[2].id, score: 5, content: '新出的番茄锅底超级好吃！', status: 'pending', create_time: new Date() }
    ]);
    console.log('Reviews created');

    // Update restaurant review counts and scores
    for (const restaurant of restaurants) {
      const approvedReviews = reviews.filter(r => r.restaurant_id === restaurant.id && r.status === 'approved');
      if (approvedReviews.length > 0) {
        const avgScore = approvedReviews.reduce((sum, r) => sum + r.score, 0) / approvedReviews.length;
        restaurant.review_count = approvedReviews.length;
        restaurant.avg_score = avgScore.toFixed(2);
        await restaurant.save();
      }
    }
    console.log('Restaurant scores updated');

    console.log('Seed data created successfully!');
    console.log('\nTest accounts:');
    console.log('Student: 20240001 / 123456');
    console.log('Merchant: M001 / 123456');
    console.log('Admin: ADMIN001 / 123456');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
