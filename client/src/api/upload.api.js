import request from './request'

export const uploadRestaurantImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return request.post('/upload/restaurant', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
