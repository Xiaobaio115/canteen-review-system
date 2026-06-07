import { useState, useEffect } from 'react'
import { Card, Row, Col, Input, Select, Rate, Tag, Pagination, Skeleton, Empty } from 'antd'
import { SearchOutlined, EnvironmentOutlined, FilterOutlined } from '@ant-design/icons'
import { SearchIllustration } from '../../components/Common/Illustrations'
import { getTypeConfig, getScoreColor } from '../../utils/restaurantConfig'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getRestaurants } from '../../api/restaurant.api'
import { RESTAURANT_TYPES, SORT_OPTIONS } from '../../utils/constants'

const { Search: SearchInput } = Input

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [query, setQuery] = useState({
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || '',
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page')) || 1,
    size: 10
  })

  useEffect(() => {
    fetchRestaurants()
  }, [query.page, query.type, query.sort, query.keyword])

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const res = await getRestaurants(query)
      setRestaurants(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSearch = (value) => {
    setQuery(prev => ({ ...prev, keyword: value, page: 1 }))
  }

  const onTypeChange = (value) => {
    setQuery(prev => ({ ...prev, type: value, page: 1 }))
  }

  const onSortChange = (value) => {
    setQuery(prev => ({ ...prev, sort: value, page: 1 }))
  }

  const onPageChange = (page) => {
    setQuery(prev => ({ ...prev, page }))
  }

  // Skeleton loader
  const renderSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <Card key={i} style={{ marginBottom: 16, borderRadius: 16, overflow: 'hidden' }}>
          <Row gutter={16} align="middle">
            <Col>
              <Skeleton.Image active style={{ width: 80, height: 80, borderRadius: 12 }} />
            </Col>
            <Col flex="auto">
              <Skeleton active paragraph={{ rows: 2 }} title={{ width: '40%' }} />
            </Col>
            <Col>
              <Skeleton.Input active size="small" style={{ width: 120 }} />
            </Col>
          </Row>
        </Card>
      ))}
    </>
  )

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      {/* Search & Filter Card */}
      <Card style={{ marginBottom: 20, borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <SearchInput
              placeholder="搜索餐厅名称..."
              enterButton={<><SearchOutlined /> 搜索</>}
              onSearch={onSearch}
              defaultValue={query.keyword}
              size="large"
              style={{ borderRadius: 12 }}
            />
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Select
              placeholder="餐厅类型"
              allowClear
              style={{ width: '100%' }}
              onChange={onTypeChange}
              value={query.type || undefined}
              options={RESTAURANT_TYPES}
              size="large"
              suffixIcon={<FilterOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Select
              placeholder="排序方式"
              style={{ width: '100%' }}
              onChange={onSortChange}
              value={query.sort}
              options={SORT_OPTIONS}
              size="large"
            />
          </Col>
        </Row>
      </Card>

      {/* Restaurant List */}
      {loading ? renderSkeleton() : (
        <>
          {restaurants.length === 0 ? (
            <Card style={{ borderRadius: 16, textAlign: 'center', padding: '40px 0' }}>
              <SearchIllustration size={100} style={{ margin: '0 auto 12px', display: 'block' }} />
              <Empty description="没有找到相关餐厅" />
            </Card>
          ) : (
            <>
              {restaurants.map((restaurant, index) => {
                const config = getTypeConfig(restaurant.type)
                const scoreColor = getScoreColor(restaurant.avg_score)

                return (
                  <Card
                    key={restaurant.id}
                    hoverable
                    className="hover-lift"
                    style={{
                      marginBottom: 16,
                      borderRadius: 16,
                      overflow: 'hidden',
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    styles={{ body: { padding: 0 } }}
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                  >
                    <Row align="middle" style={{ minHeight: 100 }}>
                      {/* Left image or gradient strip with emoji */}
                      <Col style={{ width: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{
                          width: 64,
                          height: 64,
                          borderRadius: 14,
                          background: config.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 30,
                          marginLeft: 16,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          overflow: 'hidden'
                        }}>
                          {restaurant.image ? (
                            <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            config.emoji
                          )}
                        </div>
                      </Col>

                      {/* Restaurant info */}
                      <Col flex="auto" style={{ padding: '16px 0' }}>
                        <div style={{ fontSize: 17, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>
                          {restaurant.name}
                        </div>
                        <div style={{ fontSize: 13, color: '#999', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <EnvironmentOutlined /> {restaurant.address}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Tag color="blue" style={{ margin: 0, borderRadius: 6, fontSize: 12 }}>{restaurant.type}</Tag>
                          <span style={{ color: '#ff4d4f', fontWeight: 600, fontSize: 13 }}>
                            ¥{restaurant.avg_price}/人
                          </span>
                        </div>
                      </Col>

                      {/* Right: score */}
                      <Col style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: scoreColor,
                          lineHeight: 1
                        }}>
                          {restaurant.avg_score}
                        </div>
                        <Rate disabled defaultValue={restaurant.avg_score} allowHalf style={{ fontSize: 12, marginTop: 4 }} />
                        <div style={{ color: '#bbb', fontSize: 12, marginTop: 4 }}>
                          {restaurant.review_count}条评论
                        </div>
                      </Col>
                    </Row>
                  </Card>
                )
              })}

              {/* Pagination */}
              {total > 0 && (
                <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 8 }}>
                  <Pagination
                    current={query.page}
                    total={total}
                    pageSize={query.size}
                    onChange={onPageChange}
                    showTotal={(total) => `共 ${total} 家餐厅`}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default RestaurantList
