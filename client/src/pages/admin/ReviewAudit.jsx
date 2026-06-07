import { useState, useEffect, useCallback } from 'react'
import { Card, Rate, Button, message, Pagination, Modal, Empty, Skeleton, Checkbox, Input, Select, Row, Col } from 'antd'
import { CheckOutlined, CloseOutlined, AuditOutlined, SearchOutlined } from '@ant-design/icons'
import { getPendingReviews, auditReview } from '../../api/admin.api'

const { TextArea } = Input

const ReviewAudit = () => {
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState([])
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [rejectTarget, setRejectTarget] = useState(null) // null = batch, number = single reviewId
  const [rejectReason, setRejectReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // Search/filter state
  const [searchKeyword, setSearchKeyword] = useState('')
  const [scoreFilter, setScoreFilter] = useState(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getPendingReviews({ page, size: pageSize })
      setReviews(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      message.error(error.message || '获取待审核评论失败')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Filter reviews by search and score
  const filteredReviews = reviews.filter(r => {
    const matchSearch = !searchKeyword ||
      r.restaurant?.name?.includes(searchKeyword) ||
      r.user?.nickname?.includes(searchKeyword) ||
      r.content?.includes(searchKeyword)
    const matchScore = !scoreFilter || r.score === scoreFilter
    return matchSearch && matchScore
  })

  // Single approve
  const handleApprove = async (reviewId) => {
    Modal.confirm({
      title: '确认通过',
      content: '确定通过这条点评吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await auditReview(reviewId, { status: 'approved' })
          message.success('已通过')
          setSelectedIds(prev => prev.filter(id => id !== reviewId))
          fetchReviews()
        } catch (error) {
          message.error(error.message || '操作失败')
        }
      }
    })
  }

  // Open reject modal (single or batch)
  const openRejectModal = (reviewId = null) => {
    setRejectTarget(reviewId)
    setRejectReason('')
    setRejectModalVisible(true)
  }

  // Submit reject
  const handleRejectConfirm = async () => {
    setSubmitting(true)
    try {
      const ids = rejectTarget ? [rejectTarget] : selectedIds
      await Promise.all(ids.map(id => auditReview(id, { status: 'rejected', reason: rejectReason })))
      message.success(`已拒绝 ${ids.length} 条评论`)
      setRejectModalVisible(false)
      setRejectReason('')
      setRejectTarget(null)
      setSelectedIds([])
      fetchReviews()
    } catch (error) {
      message.error(error.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  // Batch approve
  const handleBatchApprove = () => {
    if (selectedIds.length === 0) {
      message.warning('请先选择要操作的评论')
      return
    }
    Modal.confirm({
      title: '批量通过',
      content: `确定通过选中的 ${selectedIds.length} 条评论吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await Promise.all(selectedIds.map(id => auditReview(id, { status: 'approved' })))
          message.success(`已通过 ${selectedIds.length} 条评论`)
          setSelectedIds([])
          fetchReviews()
        } catch (error) {
          message.error(error.message || '批量操作失败')
        }
      }
    })
  }

  // Toggle single checkbox
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  // Toggle all
  const toggleSelectAll = () => {
    const allIds = filteredReviews.map(r => r.id)
    if (allIds.every(id => selectedIds.includes(id))) {
      setSelectedIds([])
    } else {
      setSelectedIds(allIds)
    }
  }

  const allSelected = filteredReviews.length > 0 && filteredReviews.every(r => selectedIds.includes(r.id))

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      {/* Search & Filter Bar */}
      <Card style={{ borderRadius: 16, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Input
              placeholder="搜索餐厅名称、用户昵称或评论内容..."
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="评分筛选"
              allowClear
              style={{ width: '100%' }}
              value={scoreFilter}
              onChange={setScoreFilter}
              size="large"
              options={[
                { value: 5, label: '5星' },
                { value: 4, label: '4星' },
                { value: 3, label: '3星' },
                { value: 2, label: '2星' },
                { value: 1, label: '1星' }
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={10} style={{ textAlign: 'right' }}>
            {selectedIds.length > 0 && (
              <span style={{ marginRight: 12, color: '#666', fontSize: 13 }}>
                已选 {selectedIds.length} 条
              </span>
            )}
          </Col>
        </Row>
      </Card>

      {/* Batch action bar */}
      {reviews.length > 0 && (
        <Card style={{ borderRadius: 12, marginBottom: 16, padding: '4px 0' }} styles={{ body: { padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12 } }}>
          <Checkbox checked={allSelected} onChange={toggleSelectAll}>
            全选
          </Checkbox>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            disabled={selectedIds.length === 0}
            onClick={handleBatchApprove}
            style={{ borderRadius: 8 }}
          >
            批量通过
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            disabled={selectedIds.length === 0}
            onClick={() => openRejectModal(null)}
            style={{ borderRadius: 8 }}
          >
            批量拒绝
          </Button>
        </Card>
      )}

      {/* Review list */}
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <AuditOutlined style={{ marginRight: 8, color: 'var(--primary)' }} />
            待审核评论
            {total > 0 && (
              <span style={{
                marginLeft: 10,
                background: 'linear-gradient(135deg, #faad14, #ffc53d)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600
              }}>
                {total}
              </span>
            )}
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
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <Empty description={searchKeyword || scoreFilter ? '没有匹配的评论' : '所有评论已审核完毕'} />
              </div>
            ) : (
              <>
                {filteredReviews.map((review, index) => {
                  const scoreColor = review.score >= 4 ? '#52c41a' : review.score >= 3 ? '#faad14' : '#ff4d4f'
                  const isSelected = selectedIds.includes(review.id)

                  return (
                    <div
                      key={review.id}
                      style={{
                        padding: '20px',
                        marginBottom: 16,
                        borderRadius: 14,
                        background: isSelected ? '#f0f7ff' : '#fafafa',
                        borderLeft: `4px solid ${scoreColor}`,
                        animation: `fadeInLeft 0.4s ease-out ${index * 0.05}s both`,
                        transition: 'background 0.2s ease'
                      }}
                    >
                      {/* Header with checkbox */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Checkbox checked={isSelected} onChange={() => toggleSelect(review.id)} />
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
                            <span style={{ color: '#999', margin: '0 8px' }}>评价</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{review.restaurant?.name}</span>
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
                      <div style={{ color: '#bbb', fontSize: 12, marginBottom: 14 }}>
                        {new Date(review.create_time).toLocaleString()}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => handleApprove(review.id)}
                          style={{ borderRadius: 8 }}
                        >
                          通过
                        </Button>
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => openRejectModal(review.id)}
                          style={{ borderRadius: 8 }}
                        >
                          拒绝
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {total > 0 && (
                  <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={pageSize}
                      onChange={setPage}
                      onShowSizeChange={(current, size) => { setPageSize(size); setPage(1) }}
                      showTotal={(total) => `共 ${total} 条待审核`}
                      showSizeChanger
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>

      {/* Reject reason modal */}
      <Modal
        title={rejectTarget ? '拒绝评论' : `批量拒绝 ${selectedIds.length} 条评论`}
        open={rejectModalVisible}
        onCancel={() => { setRejectModalVisible(false); setRejectReason(''); setRejectTarget(null) }}
        footer={[
          <Button key="cancel" onClick={() => { setRejectModalVisible(false); setRejectReason(''); setRejectTarget(null) }}>取消</Button>,
          <Button key="submit" danger type="primary" loading={submitting} onClick={handleRejectConfirm} style={{ borderRadius: 8 }}>
            确认拒绝
          </Button>
        ]}
      >
        <div style={{ marginBottom: 12, color: '#666', fontSize: 14 }}>
          拒绝原因（选填，将通知用户）：
        </div>
        <TextArea
          rows={3}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="请输入拒绝原因..."
          maxLength={200}
          showCount
        />
      </Modal>
    </div>
  )
}

export default ReviewAudit
