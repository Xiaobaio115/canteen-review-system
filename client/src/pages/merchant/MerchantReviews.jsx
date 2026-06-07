import { useState, useEffect, useCallback } from 'react'
import { Card, Rate, Button, Modal, Input, message, Pagination, Select, Empty, Skeleton, Radio } from 'antd'
import { MessageOutlined, ShopOutlined, SendOutlined, EditOutlined } from '@ant-design/icons'
import { getMyRestaurants, getMerchantReviews, replyReview } from '../../api/merchant.api'
import { NotebookIllustration } from '../../components/Common/Illustrations'

const { TextArea } = Input

const MerchantReviews = () => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [replyModalVisible, setReplyModalVisible] = useState(false)
  const [currentReview, setCurrentReview] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all') // all | unreplied | replied

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await getMyRestaurants()
      setRestaurants(res.data)
      if (res.data.length > 0) {
        setSelectedRestaurant(res.data[0].id)
      }
    } catch (error) {
      message.error(error.message || '获取餐厅列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchReviews = useCallback(async () => {
    if (!selectedRestaurant) return
    setLoading(true)
    try {
      const res = await getMerchantReviews(selectedRestaurant, { page, size: 10 })
      setReviews(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      message.error(error.message || '获取评论失败')
    } finally {
      setLoading(false)
    }
  }, [selectedRestaurant, page])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleReply = async () => {
    if (!replyContent.trim()) {
      message.warning('请输入回复内容')
      return
    }
    setSubmitting(true)
    try {
      await replyReview(currentReview.id, { reply_content: replyContent })
      message.success(currentReview.reply_content ? '回复已更新' : '回复成功')
      closeReplyModal()
      fetchReviews()
    } catch (error) {
      message.error(error.message || '回复失败')
    } finally {
      setSubmitting(false)
    }
  }

  const openReplyModal = (review) => {
    setCurrentReview(review)
    setReplyContent(review.reply_content || '')
    setReplyModalVisible(true)
  }

  const closeReplyModal = () => {
    setReplyModalVisible(false)
    setReplyContent('')
    setCurrentReview(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleReply()
    }
  }

  // Filter reviews
  const filteredReviews = reviews.filter(r => {
    if (filter === 'unreplied') return !r.reply_content
    if (filter === 'replied') return !!r.reply_content
    return true
  })

  // Count unreplied reviews
  const unrepliedCount = reviews.filter(r => !r.reply_content).length

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      {/* Restaurant selector + filter */}
      <Card style={{ borderRadius: 16, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <ShopOutlined style={{ fontSize: 18, color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>选择餐厅：</span>
          <Select
            style={{ width: 260 }}
            value={selectedRestaurant}
            onChange={v => { setSelectedRestaurant(v); setPage(1) }}
            options={restaurants.map(r => ({ value: r.id, label: r.name }))}
            size="large"
          />
          {unrepliedCount > 0 && (
            <span style={{
              background: 'linear-gradient(135deg, #ff4d4f, #ff7a45)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}>
              {unrepliedCount} 条待回复
            </span>
          )}
        </div>
        {/* Filter bar */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#666', fontSize: 13 }}>筛选：</span>
          <Radio.Group value={filter} onChange={e => setFilter(e.target.value)} size="small" buttonStyle="solid">
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="unreplied">未回复</Radio.Button>
            <Radio.Button value="replied">已回复</Radio.Button>
          </Radio.Group>
        </div>
      </Card>

      {/* Reviews */}
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <MessageOutlined style={{ marginRight: 8, color: 'var(--primary)' }} />
            评论管理
          </span>
        }
        style={{ borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}
      >
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <Card key={i} style={{ marginBottom: 16, borderRadius: 14 }}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </>
        ) : (
          <>
            {filteredReviews.length === 0 ? (
              <Empty
                description={
                  <div>
                    <div style={{ fontSize: 15, color: '#666', marginBottom: 4 }}>
                      {filter === 'unreplied' ? '没有未回复的评论' : filter === 'replied' ? '没有已回复的评论' : '暂无评论'}
                    </div>
                    <div style={{ fontSize: 13, color: '#999' }}>
                      {filter === 'all' ? '好评来自用心的服务，继续加油！' : ''}
                    </div>
                  </div>
                }
              >
                <NotebookIllustration size={100} style={{ margin: '0 auto 12px', display: 'block', animation: 'float 3s ease-in-out infinite' }} />
              </Empty>
            ) : (
              <>
                {filteredReviews.map((review, index) => {
                  const hasReply = !!review.reply_content
                  const scoreColor = review.score >= 4 ? '#52c41a' : review.score >= 3 ? '#faad14' : '#ff4d4f'

                  return (
                    <div
                      key={review.id}
                      style={{
                        padding: '20px',
                        marginBottom: 16,
                        borderRadius: 14,
                        background: '#fafafa',
                        borderLeft: `4px solid ${hasReply ? '#52c41a' : '#faad14'}`,
                        animation: `fadeInLeft 0.4s ease-out ${index * 0.05}s both`
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${scoreColor}, #FFC107)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 600
                          }}>
                            {review.user?.nickname?.charAt(0) || '?'}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600 }}>{review.user?.nickname}</span>
                            {review.user?.college && (
                              <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>{review.user.college}</span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Rate disabled defaultValue={review.score} style={{ fontSize: 13 }} />
                          <span style={{ fontWeight: 700, color: scoreColor }}>{review.score}分</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ fontSize: 15, lineHeight: 1.7, color: '#333', marginBottom: 8 }}>
                        {review.content}
                      </div>
                      <div style={{ color: '#bbb', fontSize: 12, marginBottom: hasReply ? 12 : 0 }}>
                        {new Date(review.create_time).toLocaleString()}
                      </div>

                      {/* Existing reply */}
                      {hasReply && (
                        <div style={{
                          marginTop: 12,
                          padding: '14px 18px',
                          background: '#f6ffed',
                          border: '1px solid #d9f7be',
                          borderRadius: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, color: '#52c41a', fontSize: 13 }}>我的回复</span>
                            <Button
                              type="link"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => openReplyModal(review)}
                              style={{ padding: 0, fontSize: 12 }}
                            >
                              编辑
                            </Button>
                          </div>
                          <div style={{ color: '#333', lineHeight: 1.6 }}>{review.reply_content}</div>
                          {review.reply_time && (
                            <div style={{ color: '#999', marginTop: 6, fontSize: 12 }}>
                              {new Date(review.reply_time).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reply button for unreplied */}
                      {!hasReply && (
                        <Button
                          type="primary"
                          icon={<SendOutlined />}
                          onClick={() => openReplyModal(review)}
                          style={{ marginTop: 12, borderRadius: 8 }}
                        >
                          回复
                        </Button>
                      )}
                    </div>
                  )
                })}

                {total > 0 && (
                  <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={10}
                      onChange={setPage}
                      showTotal={(total) => `共 ${total} 条评论`}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>

      {/* Reply Modal */}
      <Modal
        title={currentReview?.reply_content ? '编辑回复' : '回复评论'}
        open={replyModalVisible}
        onCancel={closeReplyModal}
        footer={[
          <Button key="cancel" onClick={closeReplyModal}>取消</Button>,
          <Button key="submit" type="primary" loading={submitting} onClick={handleReply} style={{ borderRadius: 8 }}>
            {currentReview?.reply_content ? '更新回复' : '提交回复'}
          </Button>
        ]}
      >
        <TextArea
          rows={4}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入回复内容... (Ctrl+Enter 快捷提交)"
          maxLength={500}
          showCount
        />
      </Modal>
    </div>
  )
}

export default MerchantReviews
