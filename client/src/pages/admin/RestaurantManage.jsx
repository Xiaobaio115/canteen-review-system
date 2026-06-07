import { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, message, Space, Popconfirm, Tag, Row, Col, Upload } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined, SearchOutlined, PictureOutlined } from '@ant-design/icons'
import { getRestaurants } from '../../api/restaurant.api'
import { createRestaurant, updateRestaurant, deleteRestaurant } from '../../api/admin.api'
import { uploadRestaurantImage } from '../../api/upload.api'
import { RESTAURANT_TYPES } from '../../utils/constants'

const RestaurantManage = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchKeyword, setSearchKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [form] = Form.useForm()
  const isDirty = useRef(false)

  useEffect(() => {
    fetchRestaurants()
  }, [pagination.current, pagination.pageSize])

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const res = await getRestaurants({ page: pagination.current, size: pagination.pageSize })
      setRestaurants(res.data.list)
      setPagination(prev => ({ ...prev, total: res.data.total }))
    } catch (error) {
      message.error(error.message || '获取餐厅列表失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredRestaurants = restaurants.filter(r => {
    const matchSearch = !searchKeyword ||
      r.name?.includes(searchKeyword) ||
      r.address?.includes(searchKeyword)
    const matchType = !typeFilter || r.type === typeFilter
    return matchSearch && matchType
  })

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
    return false
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      const data = { ...values, image: imageUrl }
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, data)
        message.success('餐厅更新成功')
      } else {
        await createRestaurant(data)
        message.success('餐厅创建成功')
      }
      closeModal()
      fetchRestaurants()
    } catch (error) {
      message.error(error.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (record) => {
    setEditingRestaurant(record)
    form.setFieldsValue(record)
    setImageUrl(record.image || '')
    isDirty.current = false
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteRestaurant(id)
      message.success('餐厅已删除')
      fetchRestaurants()
    } catch (error) {
      message.error(error.message || '删除失败')
    }
  }

  const closeModal = () => {
    if (isDirty.current) {
      Modal.confirm({
        title: '未保存的修改',
        content: '表单已修改但未保存，确定要关闭吗？',
        okText: '放弃修改',
        cancelText: '继续编辑',
        onOk: () => {
          setModalVisible(false)
          setEditingRestaurant(null)
          form.resetFields()
          setImageUrl('')
          isDirty.current = false
        }
      })
    } else {
      setModalVisible(false)
      setEditingRestaurant(null)
      form.resetFields()
      setImageUrl('')
    }
  }

  const openCreateModal = () => {
    setEditingRestaurant(null)
    form.resetFields()
    setImageUrl('')
    isDirty.current = false
    setModalVisible(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (img) => img ? (
        <img src={img} alt="" style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 6 }} />
      ) : (
        <div style={{ width: 56, height: 42, borderRadius: 6, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PictureOutlined style={{ color: '#ccc' }} />
        </div>
      )
    },
    {
      title: '餐厅名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <Tag color="blue" style={{ borderRadius: 6 }}>{text}</Tag>
    },
    {
      title: '均价',
      dataIndex: 'avg_price',
      key: 'avg_price',
      render: (text) => <span style={{ color: '#ff4d4f', fontWeight: 600 }}>¥{text}</span>
    },
    {
      title: '评分',
      dataIndex: 'avg_score',
      key: 'avg_score',
      render: (text) => (
        <span style={{ color: text >= 4 ? '#52c41a' : text >= 3 ? '#faad14' : '#ff4d4f', fontWeight: 600 }}>
          {text}
        </span>
      )
    },
    { title: '评论数', dataIndex: 'review_count', key: 'review_count' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该餐厅？"
            description="删除后不可恢复，相关评论也将被隐藏"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      <Card style={{ borderRadius: 16, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Input
              placeholder="搜索餐厅名称或地址..."
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Select
              placeholder="餐厅类型"
              allowClear
              style={{ width: '100%' }}
              value={typeFilter || undefined}
              onChange={v => setTypeFilter(v || '')}
              size="large"
              options={RESTAURANT_TYPES}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <ShopOutlined style={{ marginRight: 8, color: 'var(--primary)' }} />
            餐厅管理
          </span>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            style={{ borderRadius: 8 }}
          >
            新增餐厅
          </Button>
        }
        style={{ borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}
      >
        <Table
          columns={columns}
          dataSource={filteredRestaurants}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize })),
            showTotal: (total) => `共 ${total} 家餐厅`,
            showSizeChanger: true
          }}
          style={{ borderRadius: 12, overflow: 'hidden' }}
        />
      </Card>

      <Modal
        title={editingRestaurant ? '编辑餐厅' : '新增餐厅'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          onValuesChange={() => { isDirty.current = true }}
          layout="vertical"
          size="large"
        >
          {/* Image upload */}
          <Form.Item label="餐厅图片">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 140, height: 100, borderRadius: 10, overflow: 'hidden',
                border: '2px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: imageUrl ? '#f0f0f0' : '#fafafa'
              }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="餐厅图片" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <PictureOutlined style={{ fontSize: 28, color: '#bbb' }} />
                )}
              </div>
              <div>
                <Upload showUploadList={false} beforeUpload={handleUpload} accept="image/jpeg,image/png,image/webp">
                  <Button icon={<PlusOutlined />} loading={uploading} style={{ borderRadius: 8 }}>
                    {imageUrl ? '更换' : '上传'}
                  </Button>
                </Upload>
                <div style={{ color: '#999', fontSize: 12, marginTop: 6 }}>JPG/PNG/WebP，最大5MB</div>
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
            <InputNumber min={0} max={9999} step={0.1} precision={1} prefix="¥" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="menu_info" label="推荐菜/特色" rules={[{ max: 200, message: '不超过200个字符' }]}>
            <Input.TextArea rows={3} placeholder="请输入推荐菜或特色信息" maxLength={200} showCount />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block style={{ height: 44, borderRadius: 10 }}>
              {editingRestaurant ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RestaurantManage
