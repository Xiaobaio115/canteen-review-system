import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import { ShopOutlined, CommentOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../../store/AuthContext'
import '../../styles/layout.css'

const { Content, Footer } = Layout

const MerchantLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { key: '/merchant', icon: <ShopOutlined />, label: <Link to="/merchant">餐厅管理</Link> },
    { key: '/merchant/reviews', icon: <CommentOutlined />, label: <Link to="/merchant/reviews">评论管理</Link> }
  ]

  const userInitial = user?.nickname ? user.nickname.charAt(0).toUpperCase() : '商'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/merchant" className="header-logo">
          <div className="logo-icon">🏪</div>
          <span className="logo-text">商家后台</span>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="header-menu"
        />

        <div className="header-user">
          <div className="user-avatar">{userInitial}</div>
          <span className="user-name">{user?.nickname}</span>
          <Button type="text" onClick={handleLogout} className="logout-btn" icon={<LogoutOutlined />} size="small">
            退出
          </Button>
        </div>
      </header>

      <Content className="app-content">
        <div className="page-transition" key={location.pathname}>
          <Outlet />
        </div>
      </Content>

      <Footer className="app-footer">
        校园餐厅智能点评系统 &copy;2026
      </Footer>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <div className="nav-items">
          {[
            { key: '/merchant', icon: <ShopOutlined />, label: '餐厅' },
            { key: '/merchant/reviews', icon: <CommentOutlined />, label: '评论' }
          ].map(item => (
            <Link
              key={item.key}
              to={item.key}
              className={`nav-item ${location.pathname === item.key ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </Layout>
  )
}

export default MerchantLayout
