import authClient from './authClient'
import httpClient from './httpClient'


const BASE_URL = process.env.baseURL

const BASE_AUTH_URL = process.env.baseAuthURL

const login = (user) => httpClient.post(BASE_URL + 'auth/login', user)

const register = (user) => httpClient.post(BASE_URL + 'auth/register/students', user) 

const apiVerification = () => httpClient.post(BASE_URL + 'auth/verification')

const resendVerification = (params) => httpClient.post(BASE_URL + 'auth/verification/resend', params);

const getCurrentStudentBatch = () => httpClient.get(BASE_URL + 'student/batch/active')

const getStudentBatchById = (student_id) => httpClient.get(BASE_URL + `student/${student_id}/batch/active`)

const setEmailForgot = (email) => httpClient.post(BASE_URL + 'auth/forgot', email)

const setUserPassword = (password) => httpClient.post(BASE_URL + `user/edit/password`, password)

const updateFCM = (params) => httpClient.post(BASE_URL + `auth/fcm/update`, params)

const logout = () => authClient.post(BASE_AUTH_URL + 'signout')

const generateAppToken = () => authClient.post(BASE_AUTH_URL + `generate/token`)

const checkSession = () => authClient.get(BASE_AUTH_URL + `check`)

export {
  login,
  register,
  apiVerification,
  resendVerification,
  getCurrentStudentBatch,
  getStudentBatchById,
  setEmailForgot,
  setUserPassword,
  updateFCM,
  logout,
  generateAppToken,
  checkSession
}