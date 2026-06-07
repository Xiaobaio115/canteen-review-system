import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import {
  DashboardOutlined,
  CommentOutlined,
  ShopOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { useAuth } from '../../store/AuthContext'
import '../../styles/layout.css'

const { Sider, Content, Header } = Layout

const pageTitleMap = {
  '/admin': '数据统计',
  '/admin/reviews': '评论审核',
  '/admin/restaurants': '餐厅管理',
  '/admin/users': '用户管理'
}

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">数据统计</Link> },
    { key: '/admin/reviews', icon: <CommentOutlined />, label: <Link to="/admin/reviews">评论审核</Link> },
    { key: '/admin/restaurants', icon: <ShopOutlined />, label: <Link to="/admin/restaurants">餐厅管理</Link> },
    { key: '/admin/users', icon: <UserOutlined />, label: <Link to="/admin/users">用户管理</Link> }
  ]

  const userInitial = user?.nickname ? user.nickname.charAt(0).toUpperCase() : 'A'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Dark gradient sidebar */}
      <Sider className="admin-sider" width={220}>
        <div className="sider-logo">
          <div className="logo-icon">⚙️</div>
          <span className="logo-text">管理后台</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="admin-menu"
        />
      </Sider>

      <Layout>
        {/* Glassmorphism header */}
        <Header className="admin-header">
          <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>
            {pageTitleMap[location.pathname] || '管理后台'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 600, fontSize: 14,
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
            }}>
              {userInitial}
            </div>
            <span style={{ color: '#333', fontWeight: 500 }}>{user?.nickname}</span>
            <Button type="text" onClick={handleLogout} icon={<LogoutOutlined />} style={{ color: '#999' }}>
              退出
            </Button>
          </div>
        </Header>

        <Content style={{ margin: 20, padding: 24, background: 'var(--bg-gradient)', borderRadius: 16, minHeight: 360 }}>
          <div className="page-transition" key={location.pathname}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
