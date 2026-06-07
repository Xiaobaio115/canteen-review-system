import request from './request'

export const getRestaurants = (params) => {
  return request.get('/restaurants', { params })
}

export const getRestaurantDetail = (id) => {
  return request.get(`/restaurants/${id}`)
}
