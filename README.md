# 校园餐厅智能点评系统

校园版大众点评，服务学生选餐、评价和推荐。

## 功能特性

### 学生端
- 注册/登录
- 浏览餐厅列表，支持搜索和筛选
- 查看餐厅详情和用户点评（含评分分布图）
- 发布点评（1-5星评分 + 文字评论）
- 查看我的点评记录和审核状态
- 查看热门、好评、性价比推荐
- 个性化推荐（基于用户历史偏好）

### 商家端
- 餐厅信息维护（修改名称、地址、类型、价格等）
- 查看自己餐厅的评论
- 回复学生评论

### 管理员端
- 数据统计仪表盘
- 评论审核（通过/拒绝）
- 餐厅管理（增删改查）
- 用户管理（禁用/恢复）

## 技术栈

- **前端**: React 18 + Vite + Ant Design
- **后端**: Node.js + Express + Sequelize
- **数据库**: MySQL
- **认证**: JWT Token

## 快速开始

### 1. 环境准备

- Node.js >= 16
- MySQL >= 5.7

### 2. 数据库配置

创建数据库：
```sql
CREATE DATABASE campus_food_review DEFAULT CHARACTER SET utf8mb4;
```

### 3. 启动后端

```bash
cd server

# 安装依赖
npm install

# 配置环境变量（修改 .env 文件中的数据库连接信息）
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=campus_food_review

# 初始化种子数据
npm run seed

# 启动开发服务器
npm run dev
```

后端将运行在 http://localhost:3000

### 4. 启动前端

```bash
cd client

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将运行在 http://localhost:5173

### 5. 测试账号

| 角色 | 学号/账号 | 密码 |
|------|-----------|------|
| 学生 | 20240001 | 123456 |
| 商家 | M001 | 123456 |
| 管理员 | ADMIN001 | 123456 |

## 项目结构

```
├── server/                          # 后端
│   ├── config/                      # 配置文件
│   ├── controllers/                 # 控制器
│   ├── middleware/                  # 中间件
│   ├── models/                      # 数据模型
│   ├── routes/                      # 路由
│   ├── services/                    # 服务层
│   ├── utils/                       # 工具函数
│   └── seeders/                     # 种子数据
│
└── client/                          # 前端
    └── src/
        ├── api/                     # API请求
        ├── components/              # 组件
        ├── pages/                   # 页面
        ├── store/                   # 状态管理
        └── utils/                   # 工具函数
```

## API 接口

### 用户接口
- `POST /api/v1/auth/register` - 注册
- `POST /api/v1/auth/login` - 登录
- `GET /api/v1/users/me` - 获取用户信息
- `PUT /api/v1/users/me` - 更新用户信息

### 餐厅接口
- `GET /api/v1/restaurants` - 餐厅列表
- `GET /api/v1/restaurants/:id` - 餐厅详情
- `POST /api/v1/admin/restaurants` - 新增餐厅
- `PUT /api/v1/admin/restaurants/:id` - 更新餐厅
- `DELETE /api/v1/admin/restaurants/:id` - 删除餐厅

### 点评接口
- `POST /api/v1/reviews` - 发布点评
- `GET /api/v1/reviews/restaurant/:id` - 餐厅评论
- `GET /api/v1/reviews/my` - 我的点评
- `GET /api/v1/admin/reviews/pending` - 待审核评论
- `PUT /api/v1/admin/reviews/:id/audit` - 审核评论

### 商家接口
- `GET /api/v1/merchant/restaurants` - 我的餐厅
- `GET /api/v1/merchant/restaurants/:id/reviews` - 餐厅评论
- `POST /api/v1/merchant/reviews/:id/reply` - 回复评论

### 推荐接口
- `GET /api/v1/recommendations/hot` - 热门推荐
- `GET /api/v1/recommendations/good` - 好评推荐
- `GET /api/v1/recommendations/value` - 性价比推荐
- `GET /api/v1/recommendations/personal` - 个性化推荐（需登录）

### 管理接口
- `GET /api/v1/admin/statistics` - 统计数据
- `GET /api/v1/admin/users` - 用户列表
- `PUT /api/v1/admin/users/:id/:action` - 用户状态

## 推荐算法

```
推荐分数 = 平均评分 × 0.7 + log(评论数量 + 1) × 0.3
```

- 热门推荐：按评论数量排序
- 好评推荐：按平均评分排序
- 性价比推荐：评分高且均价低
- 个性化推荐：基于用户历史点评的餐厅类型偏好

## 特性

- **响应式设计**：支持移动端访问
- **防重复评论**：24小时内同一餐厅只能评论一次
- **数据一致性**：删除餐厅时自动处理关联评论
- **评分分布**：餐厅详情页展示评分分布图
- **个性化推荐**：根据用户偏好推荐餐厅
