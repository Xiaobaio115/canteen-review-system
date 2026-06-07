import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import { HomeOutlined, SearchOutlined, UserOutlined, LogoutOutlined, FileTextOutlined } from '@ant-design/icons'
import { useAuth } from '../../store/AuthContext'
import '../../styles/layout.css'

const { Content, Footer } = Layout

const StudentLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
    { key: '/restaurants', icon: <SearchOutlined />, label: <Link to="/restaurants">餐厅列表</Link> },
    ...(user?.role === 'student' ? [
      { key: '/my-reviews', icon: <FileTextOutlined />, label: <Link to="/my-reviews">我的点评</Link> }
    ] : []),
    ...(user?.role === 'merchant' ? [
      { key: '/merchant/reviews', icon: <UserOutlined />, label: <Link to="/merchant/reviews">商家后台</Link> }
    ] : []),
    ...(user?.role === 'admin' ? [
      { key: '/admin', icon: <UserOutlined />, label: <Link to="/admin">管理后台</Link> }
    ] : [])
  ]

  // Mobile bottom nav items
  const mobileNavItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/restaurants', icon: <SearchOutlined />, label: '餐厅' },
    ...(user?.role === 'student' ? [
      { key: '/my-reviews', icon: <FileTextOutlined />, label: '我的' }
    ] : []),
  ]

  const userInitial = user?.nickname ? user.nickname.charAt(0).toUpperCase() : '?'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Glassmorphism Header */}
      <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="header-logo">
          <div className="logo-icon">🍜</div>
          <span className="logo-text">校园餐厅点评</span>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="header-menu"
        />

        <div className="header-user">
          {user ? (
            <>
              <div className="user-avatar">{userInitial}</div>
              <span className="user-name">{user.nickname}</span>
              <Button type="text" onClick={handleLogout} className="logout-btn" icon={<LogoutOutlined />} size="small">
                退出
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')} style={{ borderRadius: 8 }}>
              登录
            </Button>
          )}
        </div>
      </header>

      {/* Main Content with page transition */}
      <Content className="app-content">
        <div className="page-transition" key={location.pathname}>
          <Outlet />
        </div>
      </Content>

      {/* Footer */}
      <Footer className="app-footer">
        校园餐厅智能点评系统 &copy;2026
      </Footer>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <div className="nav-items">
          {mobileNavItems.map(item => (
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

export default StudentLayout
