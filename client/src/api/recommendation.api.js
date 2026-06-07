import request from './request'

export const getHotRecommendations = () => {
  return request.get('/recommendations/hot')
}

export const getGoodRecommendations = () => {
  return request.get('/recommendations/good')
}

export const getValueRecommendations = () => {
  return request.get('/recommendations/value')
}

export const getPersonalRecommendations = () => {
  return request.get('/recommendations/personal')
}
