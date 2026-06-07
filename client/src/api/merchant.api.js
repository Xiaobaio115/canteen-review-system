import request from './request'

export const getMyRestaurants = () => {
  return request.get('/merchant/restaurants')
}

export const getMerchantReviews = (restaurantId, params) => {
  return request.get(`/merchant/restaurants/${restaurantId}/reviews`, { params })
}

export const replyReview = (reviewId, data) => {
  return request.post(`/merchant/reviews/${reviewId}/reply`, data)
}

export const updateMyRestaurant = (id, data) => {
  return request.put(`/merchant/restaurants/${id}`, data)
}
