export const ROLES = {
  STUDENT: 'student',
  MERCHANT: 'merchant',
  ADMIN: 'admin'
}

export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const RESTAURANT_TYPES = [
  { value: '食堂', label: '食堂' },
  { value: '快餐', label: '快餐' },
  { value: '小吃', label: '小吃' },
  { value: '奶茶', label: '奶茶' },
  { value: '面馆', label: '面馆' },
  { value: '烧烤', label: '烧烤' },
  { value: '甜品', label: '甜品' }
]

export const SORT_OPTIONS = [
  { value: '', label: '默认排序' },
  { value: 'score', label: '按评分' },
  { value: 'hot', label: '按热度' },
  { value: 'price', label: '按价格' }
]
