import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import { AuthProvider } from './store/AuthContext'
import './styles/global.css'

const theme = {
  token: {
    colorPrimary: '#FF6B35',
    borderRadius: 12,
    colorBgLayout: '#FFF8F5',
    fontFamily: "'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorSuccess: '#52C41A',
    colorWarning: '#FAAD14',
    colorError: '#FF4D4F',
    colorInfo: '#1890FF',
  },
  components: {
    Button: {
      primaryShadow: '0 2px 8px rgba(255, 107, 53, 0.35)',
      borderRadius: 10,
    },
    Card: {
      borderRadiusLG: 16,
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    },
    Menu: {
      darkItemSelectedBg: 'rgba(255, 107, 53, 0.15)',
      itemBorderRadius: 8,
    },
    Rate: {
      starColor: '#FFC107',
    },
    Input: {
      borderRadius: 10,
    },
    Select: {
      borderRadius: 10,
    },
    Modal: {
      borderRadiusLG: 16,
    },
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={zhCN} theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
)
