import { useState, useEffect, useRef } from 'react'
import { Card, Form, Input, InputNumber, Button, message, Select, Empty, Skeleton, Modal, Row, Col, Statistic, Upload } from 'antd'
import { SaveOutlined, ShopOutlined, StarOutlined, MessageOutlined, LikeOutlined, PlusOutlined, PictureOutlined } from '@ant-design/icons'
import { getMyRestaurants, updateMyRestaurant } from '../../api/merchant.api'
import { uploadRestaurantImage } from '../../api/upload.api'
import { RESTAURANT_TYPES } from '../../utils/constants'

const { TextArea } = Input

const RestaurantManage = () => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [form] = Form.useForm()
  const isDirty = useRef(false)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    if (selectedRestaurant) {
      const restaurant = restaurants.find(r => r.id === selectedRestaurant)
      if (restaurant) {
        form.setFieldsValue(restaurant)
        setImageUrl(restaurant.image || '')
        isDirty.current = false
      }
    }
  }, [selectedRestaurant, restaurants, form])

  const fetchRestaurants = async () => {
    try {
      const res = await getMyRestaurants()
      setRestaurants(res.data)
      if (res.data.length > 0) {
        setSelectedRestaurant(res.data[0].id)
      }
    } catch (error) {
      message.error(error.message || '获取餐厅信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRestaurantChange = (newId) => {
    if (isDirty.current) {
      Modal.confirm({
        title: '未保存的修改',
        content: '当前餐厅信息已修改但未保存，确定要切换吗？',
        okText: '放弃修改',
        cancelText: '继续编辑',
        onOk: () => {
          setSelectedRestaurant(newId)
        }
      })
    } else {
      setSelectedRestaurant(newId)
    }
  }

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const res = await uploadRestaurantImage(file)
      setImageUrl(res.data.url)
      isDirty.current = true
      message.success('图片上传成功')
    } catch (error) {
      message.error(error.message || '图片上传失败')
    } finally {
      setUploading(false)
    }
    return false // prevent default upload
  }

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      await updateMyRestaurant(selectedRestaurant, { ...values, image: imageUrl })
      message.success('餐厅信息更新成功')
      isDirty.current = false
      fetchRestaurants()
    } catch (error) {
      message.error(error.message || '更新失败')
    } finally {
      setSaving(false)
    }
  }

  const handleValuesChange = () => {
    isDirty.current = true
  }

  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurant)

  if (loading) {
    return (
      <Card style={{ borderRadius: 20 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    )
  }

  if (restaurants.length === 0) {
    return (
      <Card style={{ borderRadius: 20, textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
        <Empty description="暂无绑定的餐厅" />
      </Card>
    )
  }

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      {/* Restaurant selector */}
      <Card style={{ borderRadius: 16, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShopOutlined style={{ fontSize: 18, color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>选择餐厅：</span>
          <Select
            style={{ width: 300 }}
            value={selectedRestaurant}
            onChange={handleRestaurantChange}
            options={restaurants.map(r => ({ value: r.id, label: r.name }))}
            size="large"
          />
        </div>
      </Card>

      {/* Restaurant stats */}
      {currentRestaurant && (
        <Card style={{ borderRadius: 16, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
          <Row gutter={24}>
            <Col xs={8}>
              <Statistic
                title="评分"
                value={currentRestaurant.avg_score || 0}
                precision={1}
                prefix={<StarOutlined style={{ color: '#faad14' }} />}
                suffix="/ 5"
                valueStyle={{ fontSize: 24 }}
              />
            </Col>
            <Col xs={8}>
              <Statistic
                title="评论数"
                value={currentRestaurant.review_count || 0}
                prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
                suffix="条"
                valueStyle={{ fontSize: 24 }}
              />
            </Col>
            <Col xs={8}>
              <Statistic
                title="好评率"
                value={currentRestaurant.avg_score >= 4 ? '优秀' : currentRestaurant.avg_score >= 3 ? '良好' : '待提升'}
                prefix={<LikeOutlined style={{ color: currentRestaurant.avg_score >= 4 ? '#52c41a' : currentRestaurant.avg_score >= 3 ? '#faad14' : '#ff4d4f' }} />}
                valueStyle={{ fontSize: 24, color: currentRestaurant.avg_score >= 4 ? '#52c41a' : currentRestaurant.avg_score >= 3 ? '#faad14' : '#ff4d4f' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Form */}
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            餐厅信息维护
          </span>
        }
        style={{ borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
          style={{ maxWidth: 600 }}
          size="large"
        >
          {/* Image upload */}
          <Form.Item label="餐厅图片">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 160, height: 120, borderRadius: 12, overflow: 'hidden',
                border: '2px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: imageUrl ? '#f0f0f0' : '#fafafa',
                transition: 'border-color 0.3s'
              }}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="餐厅图片"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <PictureOutlined style={{ fontSize: 32, color: '#bbb' }} />
                )}
              </div>
              <div>
                <Upload
                  showUploadList={false}
                  beforeUpload={handleUpload}
                  accept="image/jpeg,image/png,image/webp"
                >
                  <Button icon={<PlusOutlined />} loading={uploading} style={{ borderRadius: 8 }}>
                    {imageUrl ? '更换图片' : '上传图片'}
                  </Button>
                </Upload>
                <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                  支持 JPG / PNG / WebP，最大 5MB
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item name="name" label="餐厅名称" rules={[{ required: true, message: '请输入餐厅名称' }, { max: 50, message: '名称不超过50个字符' }]}>
            <Input placeholder="请输入餐厅名称" />
          </Form.Item>

          <Form.Item name="address" label="地址" rules={[{ required: true, message: '请输入地址' }, { max: 100, message: '地址不超过100个字符' }]}>
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select placeholder="请选择类型" options={RESTAURANT_TYPES} />
          </Form.Item>

          <Form.Item name="avg_price" label="人均价格">
            <InputNumber min={0} max={9999} step={0.1} precision={1} prefix="¥" style={{ width: '100%' }} placeholder="请输入人均价格" />
          </Form.Item>

          <Form.Item name="menu_info" label="推荐菜/特色" rules={[{ max: 200, message: '不超过200个字符' }]}>
            <TextArea rows={4} placeholder="请输入推荐菜或特色信息" maxLength={200} showCount />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              size="large"
              style={{ borderRadius: 10, height: 44, paddingInline: 32 }}
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default RestaurantManage
