import { useState } from 'react'
import { Card, Form, Input, Button, message, Tabs } from 'antd'
import { UserOutlined, LockOutlined, ShopOutlined, SafetyOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../api/auth.api'
import { useAuth } from '../../store/AuthContext'
import '../../styles/auth.css'
import { LoginIllustration } from '../../components/Common/Illustrations'

const roleConfig = {
  student: {
    label: '学生登录',
    icon: <UserOutlined />,
    placeholder: '请输入学号',
    field: 'student_no',
    rules: [{ required: true, message: '请输入学号' }]
  },
  merchant: {
    label: '商家登录',
    icon: <ShopOutlined />,
    placeholder: '请输入商家账号',
    field: 'student_no',
    rules: [{ required: true, message: '请输入商家账号' }]
  },
  admin: {
    label: '管理员登录',
    icon: <SafetyOutlined />,
    placeholder: '请输入管理员账号',
    field: 'student_no',
    rules: [{ required: true, message: '请输入管理员账号' }]
  }
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('student')
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await login(values)
      authLogin(res.data.token, res.data.userInfo)
      message.success('登录成功')
      // 根据角色跳转到对应页面
      const userRole = res.data.userInfo.role
      if (userRole === 'admin') {
        navigate('/admin')
      } else if (userRole === 'merchant') {
        navigate('/merchant')
      } else {
        navigate('/')
      }
    } catch (error) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const currentRole = roleConfig[role]

  const tabItems = [
    {
      key: 'student',
      label: <span><UserOutlined /> 学生</span>
    },
    {
      key: 'merchant',
      label: <span><ShopOutlined /> 商家</span>
    },
    {
      key: 'admin',
      label: <span><SafetyOutlined /> 管理员</span>
    }
  ]

  return (
    <div className="auth-page">
      {/* Decorative floating circles */}
      <div className="deco-circle" />
      <div className="deco-circle" />
      <div className="deco-circle" />
      <div className="deco-circle" />
      <div className="deco-circle" />
      <div className="deco-circle" />

      <Card className="auth-card" bordered={false}>
        <div className="auth-brand">
          <LoginIllustration size={100} style={{ margin: '0 auto 8px', display: 'block' }} />
          <div className="brand-title">校园餐厅点评</div>
          <div className="brand-subtitle">发现校园美食</div>
        </div>

        {/* Role tabs */}
        <Tabs
          activeKey={role}
          onChange={setRole}
          items={tabItems}
          centered
          style={{ marginBottom: 8 }}
        />

        <Form onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item name="student_no" rules={currentRole.rules}>
            <Input
              prefix={currentRole.icon}
              placeholder={currentRole.placeholder}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="auth-submit-btn"
            >
              {currentRole.label}
            </Button>
          </Form.Item>
        </Form>

        {role === 'student' && (
          <div className="auth-footer">
            还没有账号？ <Link to="/register">立即注册</Link>
          </div>
        )}

        {/* Test account hints */}
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#bbb' }}>
          {role === 'student' && '测试账号：20240001 / 123456'}
          {role === 'merchant' && '测试账号：M001 / 123456'}
          {role === 'admin' && '测试账号：ADMIN001 / 123456'}
        </div>
      </Card>
    </div>
  )
}

export default Login
