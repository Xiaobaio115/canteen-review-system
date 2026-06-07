import { useState, useEffect } from 'react'
import { Card, Rate, Pagination, Empty, Skeleton, Tag } from 'antd'
import { EditOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { NotebookIllustration } from '../../components/Common/Illustrations'
import { getMyReviews } from '../../api/review.api'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
  pending: { color: '#faad14', bg: '#fffbe6', border: '#ffe58f', icon: <ClockCircleOutlined />, text: '审核中' },
  approved: { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', icon: <CheckCircleOutlined />, text: '已通过' },
  rejected: { color: '#ff4d4f', bg: '#fff2f0', border: '#ffccc7', icon: <CloseCircleOutlined />, text: '已拒绝' }
}

const MyReviews = () => {
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReviews()
  }, [page])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await getMyReviews({ page, size: 10 })
      setReviews(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  // Skeleton loader
  const renderSkeleton = () => (
    <>
      {[1, 2, 3].map(i => (
        <Card key={i} style={{ marginBottom: 16, borderRadius: 14 }}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      ))}
    </>
  )

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <EditOutlined style={{ marginRight: 8, color: 'var(--primary)' }} />
            我的点评
          </span>
        }
        style={{ borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}
      >
        {loading ? renderSkeleton() : (
          <>
            {reviews.length === 0 ? (
              <Empty
                description={
                  <div>
                    <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>暂无点评记录</div>
                    <div style={{ fontSize: 13, color: '#999' }}>去探索美食，写下你的第一篇点评吧！</div>
                  </div>
                }
              >
                <NotebookIllustration size={120} style={{ margin: '0 auto 16px', display: 'block', animation: 'float 3s ease-in-out infinite' }} />
              </Empty>
            ) : (
              <>
                {reviews.map((review, index) => {
                  const status = statusConfig[review.status] || statusConfig.pending

                  return (
                    <div
                      key={review.id}
                      style={{
                        padding: '20px',
                        marginBottom: 16,
                        borderRadius: 14,
                        background: '#fafafa',
                        borderLeft: `4px solid ${status.color}`,
                        animation: `fadeInLeft 0.4s ease-out ${index * 0.06}s both`,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'default'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateX(4px)'
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateX(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontSize: 16, fontWeight: 600, color: 'var(--primary)',
                              cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/restaurants/${review.restaurant?.id}`)}
                          >
                            {review.restaurant?.name}
                          </span>
                          <Tag
                            style={{
                              background: status.bg,
                              color: status.color,
                              border: `1px solid ${status.border}`,
                              borderRadius: 6
                            }}
                          >
                            {status.icon} {status.text}
                          </Tag>
                        </div>
                        <Rate disabled defaultValue={review.score} style={{ fontSize: 13 }} />
                      </div>

                      {/* Content */}
                      <div style={{ fontSize: 15, lineHeight: 1.7, color: '#333', marginBottom: 8 }}>
                        {review.content}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{review.score}分</span>
                        <span style={{ color: '#ccc' }}>|</span>
                        <span style={{ color: '#bbb', fontSize: 12 }}>
                          {new Date(review.create_time).toLocaleString()}
                        </span>
                      </div>

                      {/* Merchant reply */}
                      {review.reply_content && (
                        <div style={{
                          marginTop: 14,
                          padding: '14px 18px',
                          background: '#f6ffed',
                          border: '1px solid #d9f7be',
                          borderRadius: 12
                        }}>
                          <div style={{ fontWeight: 600, color: '#52c41a', marginBottom: 4, fontSize: 13 }}>
                            商家回复
                          </div>
                          <div style={{ color: '#333', lineHeight: 1.6 }}>{review.reply_content}</div>
                          {review.reply_time && (
                            <div style={{ color: '#999', marginTop: 6, fontSize: 12 }}>
                              {new Date(review.reply_time).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Pagination */}
                {total > 0 && (
                  <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={10}
                      onChange={setPage}
                      showTotal={(total) => `共 ${total} 条点评`}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default MyReviews
