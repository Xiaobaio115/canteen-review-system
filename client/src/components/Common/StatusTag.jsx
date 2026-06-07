import { Tag } from 'antd'

const statusConfig = {
  pending: { color: 'orange', text: '待审核' },
  approved: { color: 'green', text: '已通过' },
  rejected: { color: 'red', text: '已拒绝' }
}

const StatusTag = ({ status }) => {
  const config = statusConfig[status] || { color: 'default', text: status }
  return <Tag color={config.color}>{config.text}</Tag>
}

export default StatusTag
