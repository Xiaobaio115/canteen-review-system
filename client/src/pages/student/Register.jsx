import { useState } from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, BankOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/auth.api'
import { useAuth } from '../../store/AuthContext'
import '../../styles/auth.css'
import { LoginIllustration } from '../../components/Common/Illustrations'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await register(values)
      authLogin(res.data.token, { id: res.data.userId, nickname: res.data.nickname, role: 'student' })
      message.success('注册成功')
      navigate('/')
    } catch (error) {
      message.error(error.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

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
          <div className="brand-title">加入我们</div>
          <div className="brand-subtitle">开启美食发现之旅</div>
        </div>

        <Form onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item name="student_no" rules={[{ required: true, message: '请输入学号' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入学号"
            />
          </Form.Item>
          <Form.Item name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入昵称"
            />
          </Form.Item>
          <Form.Item name="college">
            <Input
              prefix={<BankOutlined />}
              placeholder="学院（选填）"
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码（至少6位）"
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
              注册
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          已有账号？ <Link to="/login">立即登录</Link>
        </div>
      </Card>
    </div>
  )
}

export default Register
