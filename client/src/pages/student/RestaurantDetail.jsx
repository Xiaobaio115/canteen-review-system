import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Rate, Tag, List, Button, Modal, Form, Input, message, Row, Col, Progress, Empty, Skeleton } from 'antd'
import { EditOutlined, EnvironmentOutlined, MessageOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { EmptyPlateIllustration } from '../../components/Common/Illustrations'
import { getRestaurantDetail } from '../../api/restaurant.api'
import { getRestaurantReviews, createReview } from '../../api/review.api'
import { useAuth } from '../../store/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getTypeConfig, getScoreColor } from '../../utils/restaurantConfig'

const { TextArea } = Input

const RestaurantDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [restaurantRes, reviewsRes] = await Promise.all([
        getRestaurantDetail(id),
        getRestaurantReviews(id, { page: 1, size: 20 })
      ])
      setRestaurant(restaurantRes.data)
      setReviews(reviewsRes.data.list)
    } catch (error) {
      message.error('获取餐厅信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (values) => {
    setSubmitting(true)
    try {
      await createReview({
        restaurant_id: parseInt(id),
        score: values.score,
        content: values.content
      })
      message.success('点评发布成功，等待管理员审核')
      setReviewModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error(error.message || '发布失败')
    } finally {
      setSubmitting(false)
    }
  }

  const getScoreDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      if (review.score >= 1 && review.score <= 5) {
        distribution[review.score]++
      }
    })
    return distribution
  }

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
        <Card style={{ borderRadius: 16, marginBottom: 16 }}>
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Col>
            <Col xs={24} md={8}>
              <Skeleton.Input active block style={{ height: 120 }} />
            </Col>
          </Row>
        </Card>
        <Card style={{ borderRadius: 16 }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <Card style={{ borderRadius: 16, textAlign: 'center', padding: '60px 0' }}>
        <Empty description="餐厅不存在" />
        <Button type="primary" onClick={() => navigate('/restaurants')} style={{ marginTop: 16 }}>
          返回餐厅列表
        </Button>
      </Card>
    )
  }

  const config = getTypeConfig(restaurant.type)
  const scoreColor = getScoreColor(restaurant.avg_score)
  const scoreDistribution = getScoreDistribution()
  const totalReviews = reviews.length

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      {/* Hero Section */}
      <Card style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20, boxShadow: 'var(--shadow-md)' }}>
        <div style={{
          background: config.gradient,
          margin: '-24px -24px 24px',
          padding: '32px 28px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: restaurant.image ? 220 : 'auto'
        }}>
          {/* Background image overlay */}
          {restaurant.image && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${restaurant.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3
            }} />
          )}
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', width: 160, height: 160, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', top: -40, right: -20,
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', bottom: -20, left: '30%',
            animation: 'float-slow 8s ease-in-out infinite'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/restaurants')}
              style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 12, padding: '4px 8px' }}
            >
              返回列表
            </Button>
            <h1 style={{
              fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8,
              textShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              {config.emoji} {restaurant.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
              <EnvironmentOutlined /> {restaurant.address}
            </div>
          </div>
        </div>

        {/* Info cards row */}
        <Row gutter={16}>
          {/* Score card */}
          <Col xs={24} md={8}>
            <div style={{
              textAlign: 'center',
              padding: '24px 16px',
              background: '#fafafa',
              borderRadius: 14,
              marginBottom: 16
            }}>
              <div style={{
                fontSize: 48,
                fontWeight: 800,
                color: scoreColor,
                lineHeight: 1,
                animation: 'bounceIn 0.6s ease-out'
              }}>
                {restaurant.avg_score}
              </div>
              <Rate disabled defaultValue={restaurant.avg_score} allowHalf style={{ fontSize: 18, marginTop: 8 }} />
              <div style={{ marginTop: 8, color: '#888', fontSize: 14 }}>
                {restaurant.review_count} 条评论
              </div>
            </div>
          </Col>

          {/* Details */}
          <Col xs={24} md={16}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8 }}>
                {restaurant.type}
              </Tag>
              <Tag color="red" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8 }}>
                ¥{restaurant.avg_price}/人
              </Tag>
            </div>
            {restaurant.menu_info && (
              <div style={{
                padding: '14px 18px',
                background: '#fff7e6',
                borderRadius: 12,
                border: '1px solid #ffe7ba',
                color: '#874d00',
                fontSize: 14
              }}>
                <span style={{ fontWeight: 600 }}>推荐菜/特色：</span>{restaurant.menu_info}
              </div>
            )}
          </Col>
        </Row>

        {/* Score Distribution */}
        {totalReviews > 0 && (
          <Card
            size="small"
            title="评分分布"
            style={{ marginTop: 16, background: '#fafafa', borderRadius: 12 }}
          >
            {[5, 4, 3, 2, 1].map(score => (
              <div key={score} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ width: 36, fontWeight: 600, color: '#666' }}>{score}星</span>
                <Progress
                  percent={totalReviews > 0 ? Math.round((scoreDistribution[score] / totalReviews) * 100) : 0}
                  size="small"
                  style={{ flex: 1, margin: '0 12px' }}
                  strokeColor={score >= 4 ? '#52c41a' : score >= 3 ? '#faad14' : '#ff4d4f'}
                  showInfo={false}
                />
                <span style={{ width: 40, textAlign: 'right', color: '#999', fontSize: 13 }}>
                  {scoreDistribution[score]}人
                </span>
              </div>
            ))}
          </Card>
        )}

        {/* Write Review Button */}
        {user?.role === 'student' && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setReviewModalVisible(true)}
            size="large"
            style={{ marginTop: 16, borderRadius: 10, height: 44 }}
          >
            写点评
          </Button>
        )}
      </Card>

      {/* Reviews Section */}
      <Card
        title={<span style={{ fontSize: 18, fontWeight: 600 }}><MessageOutlined /> 用户点评</span>}
        style={{ borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}
      >
        {reviews.length === 0 ? (
          <Empty description="暂无点评，快来写第一条吧！">
            <EmptyPlateIllustration size={100} style={{ margin: '0 auto 12px', display: 'block' }} />
            {user?.role === 'student' && (
              <Button type="primary" onClick={() => setReviewModalVisible(true)}>
                写点评
              </Button>
            )}
          </Empty>
        ) : (
          <List
            dataSource={reviews}
            renderItem={(review, index) => {
              const reviewScoreColor = getScoreColor(review.score)
              return (
                <div
                  style={{
                    padding: '20px',
                    marginBottom: 16,
                    borderRadius: 14,
                    background: '#fafafa',
                    borderLeft: `4px solid ${reviewScoreColor}`,
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                  }}
                >
                  {/* Review header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${reviewScoreColor}, #FFC107)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 600, fontSize: 14
                      }}>
                        {review.user?.nickname?.charAt(0) || '?'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{review.user?.nickname}</span>
                        {review.user?.college && (
                          <Tag style={{ marginLeft: 8, borderRadius: 6, fontSize: 11 }}>{review.user.college}</Tag>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Rate disabled defaultValue={review.score} style={{ fontSize: 13 }} />
                      <span style={{ fontWeight: 700, color: reviewScoreColor, fontSize: 15 }}>{review.score}分</span>
                    </div>
                  </div>

                  {/* Review content */}
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: '#333', marginBottom: 8 }}>
                    {review.content}
                  </div>
                  <div style={{ color: '#bbb', fontSize: 12 }}>
                    {new Date(review.create_time).toLocaleString()}
                  </div>

                  {/* Merchant reply */}
                  {review.reply_content && (
                    <div style={{
                      marginTop: 14,
                      padding: '14px 18px',
                      background: '#f6ffed',
                      border: '1px solid #d9f7be',
                      borderRadius: 12,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute', top: -8, left: 16,
                        background: '#f6ffed', padding: '0 8px',
                        fontSize: 12, fontWeight: 600, color: '#52c41a'
                      }}>
                        商家回复
                      </div>
                      <div style={{ marginTop: 4, color: '#333', lineHeight: 1.6 }}>
                        {review.reply_content}
                      </div>
                      <div style={{ color: '#999', marginTop: 6, fontSize: 12 }}>
                        {new Date(review.reply_time).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )
            }}
          />
        )}
      </Card>

      {/* Review Modal */}
      <Modal
        title="写点评"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
        style={{ borderRadius: 16 }}
      >
        <Form form={form} onFinish={handleSubmitReview} layout="vertical">
          <Form.Item name="score" label="评分" rules={[{ required: true, message: '请选择评分' }]}>
            <Rate style={{ fontSize: 28 }} />
          </Form.Item>
          <Form.Item name="content" label="点评内容" rules={[{ required: true, message: '请输入点评内容' }, { min: 10, message: '点评内容至少10个字' }]}>
            <TextArea rows={4} placeholder="分享你的用餐体验，至少10个字..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block style={{ height: 44, borderRadius: 10 }}>
              提交点评
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RestaurantDetail
