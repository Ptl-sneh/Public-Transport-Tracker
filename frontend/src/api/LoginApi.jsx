import Api from './Api'

const registerUser = (username, email, password) => {
  return Api.post('/register/', {username,email,password})
}

const loginUser = (username, password) => {
  return Api.post('/auth/login/',{username,password})
}

const refreshToken = (refresh) => {
  return Api.post('/auth/refresh' , {refresh})
}



export {registerUser , loginUser , refreshToken}