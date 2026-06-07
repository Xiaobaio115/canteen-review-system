import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, Row, Col, Skeleton, message, Button } from 'antd'
import {
  UserOutlined,
  ShopOutlined,
  CommentOutlined,
  ClockCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getStatistics } from '../../api/admin.api'

// Animated counter hook
const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (target === undefined || target === null) return
    const start = 0
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (target - start) * eased)
      setCount(current)

      if (progress < 1) {
        ref.current = requestAnimationFrame(animate)
      }
    }

    ref.current = requestAnimationFrame(animate)
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current)
    }
  }, [target, duration])

  return count
}

// Stat card config
const statCards = [
  {
    key: 'userCount',
    title: '用户总数',
    icon: <UserOutlined />,
    gradient: 'linear-gradient(135deg, #1890FF, #36CFC9)',
    iconBg: 'rgba(24, 144, 255, 0.12)',
    iconColor: '#1890FF',
    suffix: '人',
    link: '/admin/users'
  },
  {
    key: 'restaurantCount',
    title: '餐厅总数',
    icon: <ShopOutlined />,
    gradient: 'linear-gradient(135deg, #52C41A, #95DE64)',
    iconBg: 'rgba(82, 196, 26, 0.12)',
    iconColor: '#52C41A',
    suffix: '家',
    link: '/admin/restaurants'
  },
  {
    key: 'reviewCount',
    title: '评论总数',
    icon: <CommentOutlined />,
    gradient: 'linear-gradient(135deg, #FF6B35, #FFC107)',
    iconBg: 'rgba(255, 107, 53, 0.12)',
    iconColor: '#FF6B35',
    suffix: '条',
    link: null
  },
  {
    key: 'pendingReviewCount',
    title: '待审核评论',
    icon: <ClockCircleOutlined />,
    gradient: 'linear-gradient(135deg, #FAAD14, #FFC53D)',
    iconBg: 'rgba(250, 173, 20, 0.12)',
    iconColor: '#FAAD14',
    suffix: '条',
    link: '/admin/reviews'
  }
]

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const userCount = useCountUp(stats?.userCount)
  const restaurantCount = useCountUp(stats?.restaurantCount)
  const reviewCount = useCountUp(stats?.reviewCount)
  const pendingCount = useCountUp(stats?.pendingReviewCount)

  const counts = {
    userCount,
    restaurantCount,
    reviewCount,
    pendingReviewCount: pendingCount
  }

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await getStatistics()
      setStats(res.data)
    } catch (err) {
      message.error('获取统计数据失败')
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#1a1a1a' }}>系统数据统计</h2>
        <Row gutter={[20, 20]}>
          {[1, 2, 3, 4].map(i => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card style={{ borderRadius: 16 }}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>统计数据加载失败</div>
        <Button type="primary" icon={<ReloadOutlined />} onClick={fetchStats} size="large" style={{ borderRadius: 10 }}>
          重新加载
        </Button>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#1a1a1a' }}>
        系统数据统计
      </h2>

      <Row gutter={[20, 20]}>
        {statCards.map((card, index) => {
          const isClickable = !!card.link
          return (
            <Col xs={24} sm={12} lg={6} key={card.key}>
              <Card
                hoverable={isClickable}
                onClick={() => isClickable && navigate(card.link)}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.3s ease'
                }}
                styles={{ body: { padding: 0 } }}
              >
                {/* Gradient top bar */}
                <div style={{ height: 4, background: card.gradient }} />

                <div style={{ padding: '24px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: card.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, color: card.iconColor
                    }}>
                      {card.icon}
                    </div>
                    {isClickable && (
                      <span style={{ fontSize: 12, color: '#bbb' }}>点击查看详情 →</span>
                    )}
                  </div>

                  <div style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: '#1a1a1a',
                    lineHeight: 1,
                    marginBottom: 6
                  }}>
                    {counts[card.key]}
                  </div>

                  <div style={{ fontSize: 14, color: '#999', fontWeight: 500 }}>
                    {card.title}
                  </div>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default Dashboard
