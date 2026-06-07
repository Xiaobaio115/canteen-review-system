import request from './request'

export const createReview = (data) => {
  return request.post('/reviews', data)
}

export const getRestaurantReviews = (restaurantId, params) => {
  return request.get(`/reviews/restaurant/${restaurantId}`, { params })
}

export const getMyReviews = (params) => {
  return request.get('/reviews/my', { params })
}
