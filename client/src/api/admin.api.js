import request from './request'

export const getStatistics = () => {
  return request.get('/admin/statistics')
}

export const getPendingReviews = (params) => {
  return request.get('/admin/reviews/pending', { params })
}

export const auditReview = (reviewId, data) => {
  return request.put(`/admin/reviews/${reviewId}/audit`, data)
}

export const getUsers = (params) => {
  return request.get('/admin/users', { params })
}

export const toggleUserStatus = (userId, action) => {
  return request.put(`/admin/users/${userId}/${action}`)
}

export const createRestaurant = (data) => {
  return request.post('/admin/restaurants', data)
}

export const updateRestaurant = (id, data) => {
  return request.put(`/admin/restaurants/${id}`, data)
}

export const deleteRestaurant = (id) => {
  return request.delete(`/admin/restaurants/${id}`)
}
