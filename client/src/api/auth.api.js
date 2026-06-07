import request from './request'

export const register = (data) => {
  return request.post('/auth/register', data)
}

export const login = (data) => {
  return request.post('/auth/login', data)
}

export const getMe = () => {
  return request.get('/users/me')
}

export const updateMe = (data) => {
  return request.put('/users/me', data)
}
