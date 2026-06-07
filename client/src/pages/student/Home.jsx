import { useState, useEffect } from 'react'
import { Card, Row, Col, Input, Rate, Tag, Tabs, Skeleton, Empty } from 'antd'
import { FireOutlined, LikeOutlined, DollarOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import { FoodIllustration } from '../../components/Common/Illustrations'
import { getTypeConfig, getScoreColor } from '../../utils/restaurantConfig'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import {
  getHotRecommendations,
  getGoodRecommendations,
  getValueRecommendations,
  getPersonalRecommendations
} from '../../api/recommendation.api'

const { Search: SearchInput } = Input

const Home = () => {
  const [hotRestaurants, setHotRestaurants] = useState([])
  const [goodRestaurants, setGoodRestaurants] = useState([])
  const [valueRestaurants, setValueRestaurants] = useState([])
  const [personalRestaurants, setPersonalRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const promises = [
          getHotRecommendations(),
          getGoodRecommendations(),
          getValueRecommendations()
        ]

        if (user) {
          promises.push(getPersonalRecommendations())
        }

        const results = await Promise.all(promises)
        setHotRestaurants(results[0].data)
        setGoodRestaurants(results[1].data)
        setValueRestaurants(results[2].data)

        if (user && results[3]) {
          setPersonalRestaurants(results[3].data)
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [user])

  const onSearch = (value) => {
    navigate(`/restaurants?keyword=${value}`)
  }

  // Skeleton card for loading state
  const renderSkeletonCard = (_, index) => (
    <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
      <Card
        hoverable
        style={{ height: '100%', borderRadius: 16, overflow: 'hidden' }}
        styles={{ body: { padding: 0 } }}
      >
        <Skeleton.Image active style={{ width: '100%', height: 120 }} />
        <div style={{ padding: '16px' }}>
          <Skeleton active paragraph={{ rows: 2 }} title={{ width: '60%' }} />
        </div>
      </Card>
    </Col>
  )

  // Restaurant card component
  const renderRestaurantCard = (restaurant, index) => {
    const config = getTypeConfig(restaurant.type)
    const scoreColor = getScoreColor(restaurant.avg_score)

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={restaurant.id}>
        <Card
          hoverable
          className={`hover-lift stagger-${(index % 8) + 1}`}
          style={{
            height: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            animation: 'fadeInUp 0.5s ease-out both',
            cursor: 'pointer'
          }}
          styles={{ body: { padding: 0 } }}
          onClick={() => navigate(`/restaurants/${restaurant.id}`)}
        >
          {/* Type gradient header */}
          <div style={{
            background: config.gradient,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {restaurant.image ? (
              <img
                src={restaurant.image}
                alt={restaurant.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: 42, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                {config.emoji}
              </span>
            )}
            {/* Score badge */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              lineHeight: 1
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: scoreColor }}>
                {restaurant.avg_score}
              </span>
              <span style={{ fontSize: 9, color: '#999' }}>分</span>
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {restaurant.address}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tag color="blue" style={{ margin: 0, borderRadius: 6 }}>{restaurant.type}</Tag>
              <span style={{ color: '#ff4d4f', fontWeight: 600, fontSize: 14 }}>
                ¥{restaurant.avg_price}/人
              </span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Rate disabled defaultValue={restaurant.avg_score} allowHalf style={{ fontSize: 12 }} />
              <span style={{ color: '#bbb', fontSize: 12 }}>{restaurant.review_count}条评论</span>
            </div>
            {restaurant.reason && (
              <div style={{
                marginTop: 10,
                padding: '6px 10px',
                background: '#fff7e6',
                borderRadius: 8,
                color: '#d46b08',
                fontSize: 12,
                border: '1px solid #ffe7ba'
              }}>
                {restaurant.reason}
              </div>
            )}
          </div>
        </Card>
      </Col>
    )
  }

  // Render restaurant grid
  const renderRestaurantGrid = (restaurants, emptyText) => {
    if (loading) {
      return (
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(renderSkeletonCard)}
        </Row>
      )
    }
    if (!restaurants || restaurants.length === 0) {
      return <Empty description={emptyText || '暂无推荐'} style={{ padding: '40px 0' }} />
    }
    return (
      <Row gutter={[16, 16]}>
        {restaurants.map((r, i) => renderRestaurantCard(r, i))}
      </Row>
    )
  }

  const tabItems = [
    {
      key: 'hot',
      label: <span><FireOutlined style={{ color: '#ff4d4f' }} /> 热门推荐</span>,
      children: renderRestaurantGrid(hotRestaurants, '暂无热门餐厅')
    },
    {
      key: 'good',
      label: <span><LikeOutlined style={{ color: '#52c41a' }} /> 好评推荐</span>,
      children: renderRestaurantGrid(goodRestaurants, '暂无好评餐厅')
    },
    {
      key: 'value',
      label: <span><DollarOutlined style={{ color: '#faad14' }} /> 性价比推荐</span>,
      children: renderRestaurantGrid(valueRestaurants, '暂无性价比餐厅')
    }
  ]

  if (user) {
    tabItems.push({
      key: 'personal',
      label: <span><UserOutlined style={{ color: '#1890ff' }} /> 猜你喜欢</span>,
      children: renderRestaurantGrid(personalRestaurants, '暂无个性化推荐，多点评几家用餐吧')
    })
  }

  return (
    <div>
      {/* Animated Banner */}
      <div style={{
        textAlign: 'center',
        marginBottom: 28,
        padding: '48px 24px',
        background: 'linear-gradient(135deg, #FF6B35 0%, #E55A25 40%, #FF8F65 70%, #FFC107 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite',
        borderRadius: 20,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(255, 107, 53, 0.25)'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', top: -60, right: -40,
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', bottom: -30, left: '20%',
          animation: 'float-slow 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', top: 20, left: '10%',
          animation: 'float 5s ease-in-out infinite 1s'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <FoodIllustration size={90} style={{ margin: '0 auto 12px', display: 'block', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
          <h1 style={{
            fontSize: 36, marginBottom: 8, fontWeight: 700,
            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
            letterSpacing: 2
          }}>
            🍜 校园餐厅智能点评
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 28, letterSpacing: 1 }}>
            发现校园周边美食，查看真实评价
          </p>
          <SearchInput
            placeholder="搜索餐厅名称..."
            enterButton={<><SearchOutlined /> 搜索</>}
            size="large"
            onSearch={onSearch}
            style={{
              maxWidth: 520,
              margin: '0 auto'
            }}
            className="banner-search"
          />
        </div>
      </div>

      {/* Recommendation Tabs */}
      <Card style={{ borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
        <Tabs
          items={tabItems}
          size="large"
          tabBarGutter={24}
        />
      </Card>
    </div>
  )
}

export default Home
