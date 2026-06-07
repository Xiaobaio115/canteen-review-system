import { Rate } from 'antd'

const StarRating = ({ value, disabled = true, onChange, allowHalf = true }) => {
  return (
    <Rate
      disabled={disabled}
      value={value}
      onChange={onChange}
      allowHalf={allowHalf}
    />
  )
}

export default StarRating
