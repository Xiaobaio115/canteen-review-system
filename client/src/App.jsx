import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/AuthContext'
import StudentLayout from './components/Layout/StudentLayout'
import MerchantLayout from './components/Layout/MerchantLayout'
import AdminLayout from './components/Layout/AdminLayout'
import Login from './pages/student/Login'
import Register from './pages/student/Register'
import Home from './pages/student/Home'
import RestaurantList from './pages/student/RestaurantList'
import RestaurantDetail from './pages/student/RestaurantDetail'
import MyReviews from './pages/student/MyReviews'
import MerchantReviews from './pages/merchant/MerchantReviews'
import MerchantRestaurantManage from './pages/merchant/RestaurantManage'
import Dashboard from './pages/admin/Dashboard'
import ReviewAudit from './pages/admin/ReviewAudit'
import RestaurantManage from './pages/admin/RestaurantManage'
import UserManage from './pages/admin/UserManage'

// 根据角色跳转到对应首页
function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role === 'admin') return <Navigate to="/admin" />
  if (user.role === 'merchant') return <Navigate to="/merchant" />
  return <Navigate to="/" />
}

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <RoleRedirect />} />
      <Route path="/register" element={!user ? <Register /> : <RoleRedirect />} />

      {/* Student routes */}
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} />
        <Route path="restaurants" element={<RestaurantList />} />
        <Route path="restaurants/:id" element={<RestaurantDetail />} />
        <Route path="my-reviews" element={user?.role === 'student' ? <MyReviews /> : <Navigate to="/login" />} />
      </Route>

      {/* Merchant routes */}
      <Route path="/merchant" element={user?.role === 'merchant' ? <MerchantLayout /> : <Navigate to="/login" />}>
        <Route index element={<MerchantRestaurantManage />} />
        <Route path="reviews" element={<MerchantReviews />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="reviews" element={<ReviewAudit />} />
        <Route path="restaurants" element={<RestaurantManage />} />
        <Route path="users" element={<UserManage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  )
}

export default App
