import { Empty, Button } from 'antd'

const EmptyState = ({ description = '暂无数据', buttonText, onButtonClick }) => {
  return (
    <Empty
      description={description}
      style={{ padding: '50px' }}
    >
      {buttonText && onButtonClick && (
        <Button type="primary" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </Empty>
  )
}

export default EmptyState
