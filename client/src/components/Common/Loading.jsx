import { Spin } from 'antd'

const Loading = ({ size = 'default' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
      <Spin size={size} />
    </div>
  )
}

export default Loading
