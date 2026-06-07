import { useState, useEffect } from 'react'
import { Card, Table, Button, message, Space, Tag, Popconfirm, Select, Input, Row, Col } from 'antd'
import { StopOutlined, CheckCircleOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import { getUsers, toggleUserStatus } from '../../api/admin.api'

const roleMap = {
  student: { color: 'blue', text: '学生', bg: '#e6f7ff', border: '#91d5ff' },
  merchant: { color: 'green', text: '商家', bg: '#f6ffed', border: '#b7eb8f' },
  admin: { color: 'red', text: '管理员', bg: '#fff2f0', border: '#ffccc7' }
}

const UserManage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [roleFilter, setRoleFilter] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [pagination.current, pagination.pageSize, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (roleFilter) params.role = roleFilter
      const res = await getUsers(params)
      setUsers(res.data.list)
      setPagination(prev => ({ ...prev, total: res.data.total }))
    } catch (error) {
      message.error(error.message || '获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus === 1 ? 'disable' : 'enable'
    try {
      await toggleUserStatus(userId, action)
      message.success(currentStatus === 1 ? '用户已禁用' : '用户已恢复')
      fetchUsers()
    } catch (error) {
      message.error(error.message || '操作失败')
    }
  }

  // Client-side search filter
  const filteredUsers = users.filter(u => {
    if (!searchKeyword) return true
    return (
      u.nickname?.includes(searchKeyword) ||
      u.student_no?.includes(searchKeyword)
    )
  })

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '学号/账号', dataIndex: 'student_no', key: 'student_no' },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleMap[record.role]?.color === 'blue' ? '#1890FF' : roleMap[record.role]?.color === 'green' ? '#52C41A' : '#FF4D4F'}, #FFC107)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 600, fontSize: 12
          }}>
            {text?.charAt(0) || '?'}
          </div>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      )
    },
    { title: '学院', dataIndex: 'college', key: 'college', render: (text) => text || '-' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const config = roleMap[role]
        return (
          <Tag
            style={{
              background: config?.bg,
              color: config?.color === 'blue' ? '#1890FF' : config?.color === 'green' ? '#52C41A' : '#FF4D4F',
              border: `1px solid ${config?.border}`,
              borderRadius: 6
            }}
          >
            {config?.text}
          </Tag>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'} style={{ borderRadius: 6 }}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => new Date(text).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.role !== 'admin' && (
            <Popconfirm
              title={record.status === 1 ? '确定禁用该用户？' : '确定恢复该用户？'}
              description={record.status === 1 ? '禁用后该用户将无法登录系统' : '恢复后该用户可以正常登录'}
              onConfirm={() => handleToggleStatus(record.id, record.status)}
              okText="确定"
              cancelText="取消"
              okButtonProps={{ danger: record.status === 1 }}
            >
              <Button
                type="link"
                danger={record.status === 1}
                icon={record.status === 1 ? <StopOutlined /> : <CheckCircleOutlined />}
              >
                {record.status === 1 ? '禁用' : '恢复'}
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      {/* Search & Filter */}
      <Card style={{ borderRadius: 16, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Input
              placeholder="搜索昵称或学号..."
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Select
              placeholder="筛选角色"
              allowClear
              style={{ width: '100%' }}
              value={roleFilter || undefined}
              onChange={(value) => { setRoleFilter(value || ''); setPagination(prev => ({ ...prev, current: 1 })) }}
              size="large"
              options={[
                { value: 'student', label: '学生' },
                { value: 'merchant', label: '商家' },
                { value: 'admin', label: '管理员' }
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <UserOutlined style={{ marginRight: 8, color: 'var(--primary)' }} />
            用户管理
          </span>
        }
        style={{ borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize })),
            showTotal: (total) => `共 ${total} 位用户`,
            showSizeChanger: true
          }}
          style={{ borderRadius: 12, overflow: 'hidden' }}
        />
      </Card>
    </div>
  )
}

export default UserManage
