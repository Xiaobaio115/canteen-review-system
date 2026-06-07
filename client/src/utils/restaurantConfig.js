// Restaurant type config: gradient + emoji
export const typeConfig = {
  '食堂': { gradient: 'linear-gradient(135deg, #FF6B35, #FFC107)', emoji: '🍚' },
  '快餐': { gradient: 'linear-gradient(135deg, #FF4D4F, #FF7A45)', emoji: '🍔' },
  '小吃': { gradient: 'linear-gradient(135deg, #FAAD14, #FFC53D)', emoji: '🥟' },
  '奶茶': { gradient: 'linear-gradient(135deg, #FF85C0, #FF6B9D)', emoji: '🧋' },
  '面馆': { gradient: 'linear-gradient(135deg, #95DE64, #52C41A)', emoji: '🍜' },
  '烧烤': { gradient: 'linear-gradient(135deg, #FF4D4F, #CF1322)', emoji: '🍖' },
  '甜品': { gradient: 'linear-gradient(135deg, #B37FEB, #722ED1)', emoji: '🍰' },
  'default': { gradient: 'linear-gradient(135deg, #FF6B35, #FF8F65)', emoji: '🍴' }
}

export const getTypeConfig = (type) => typeConfig[type] || typeConfig['default']

// Score color based on rating
export const getScoreColor = (score) => {
  if (score >= 4.5) return '#52c41a'
  if (score >= 3.5) return '#73d13d'
  if (score >= 2.5) return '#faad14'
  if (score >= 1.5) return '#ff7a45'
  return '#ff4d4f'
}
