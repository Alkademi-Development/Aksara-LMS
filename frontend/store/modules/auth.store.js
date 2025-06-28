import {
  login,
  register,
  apiVerification,
  getCurrentStudentBatch,
  getStudentBatchById,
  logout,
  setEmailForgot,
  setUserPassword,
  resendVerification,
  updateFCM,
  generateAppToken,
  checkSession
} from "@/api/auth.api";

const mapUserRole = (kind) => {
  const map = {
    0: 'superadmin',
    1: 'admin',
    2: 'mentor',
    3: 'teacher',
    4: 'student',
    5: 'industry',
    6: 'writer',
    7: 'lead_program',
    8: 'partner'
  }
  return map[kind] || null
}

export default {
  namespaced: true,
  state: {
    user: localStorage.getItem("user") || {},
    access_token: localStorage.getItem("access_token")|| null,
    user_kind: localStorage.getItem("user_kind") || null,
    student_batch: localStorage.getItem("student_batch") || null,
    message: '',
    appToken: null,
    status: false,
    session: false,
    userPermission: false,
    appVersion: null,
    isAppTokenValid: false,
  },

  mutations: {
    SET_RESPONSE(state, { message, status }){
      state.message = message
      state.status = status
    },
    SET_SESSION(state, session){
      state.session = session
    },
    SET_USER(state, { user, access_token, user_kind }){
      state.user = user
      state.access_token = access_token
      state.user_kind = user_kind
    },
    SET_STUDENT_BATCH(state, batch) {
      state.student_batch = batch
    },
    EMAIL_FORGOT(state, email){
      state.email_forgot = email
    },
    SET_APP_TOKEN(state, token){
      state.appToken = token
    },
    SET_PERMISSION(state, data){
        state.userPermission = data
    },
    SET_APP_VERSION(state, version) {
      state.appVersion = version
    },
    SET_APP_TOKEN_VALID(state, isValid) {
      state.isAppTokenValid = isValid
    },
    LOGOUT(state) {
      state.user = []
      state.access_token = null
      state.refresh_token = null
      state.user_kind = null
    }
  },

  actions: {
    async login({commit}, user) {
      try {
        const response = await login(user)

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        var user = {
          id: response.data.data.id,
          email: response.data.data.email,
          name: response.data.data.name,
          kind: response.data.data.kind
        }

        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("access_token", response.data.data.token)

        const payload = {
          user: user,
          access_token: response.data.data.token,
          user_kind: response.data.data.kind
        }

        commit('SET_USER', payload)
      } catch (error) {
        console.error('Failed to login', error);
      }
    },

    async register({commit}, user) {
      try {
        const response = await register(user)

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)
      } catch (error) {
        console.error('Failed to Register', error);
      }
    },

    async fetchCurrentStudentBatch({commit}) {
      try {
        const response = await getCurrentStudentBatch()

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        var payload = response.data.data

        localStorage.setItem("student_batch", JSON.stringify(response.data.data))

        commit('SET_STUDENT_BATCH', payload)
      } catch (error) {
        console.error("Failed to Fetch Student Batch: ", error);
      }
    },

    async fetchStudentBatchById({commit}, student_id) {
      try {
        const response = await getStudentBatchById(student_id)

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        var payload = response.data.data

        commit('SET_STUDENT_BATCH', payload)
      } catch (error) {
        console.error("Failed to Fetch Student Batch: ", error);
      }
    },

    async verification({commit}, token) {
      try {
        localStorage.setItem("access_token", token)

        const response = await apiVerification()

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        var user = {
          id: response.data.data.id,
          email: response.data.data.email,
          name: response.data.data.name,
          kind: response.data.data.kind
        }

        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("access_token", response.data.data.token)

        const payload = {
          user: user,
          access_token: response.data.data.token,
          user_kind: response.data.data.kind
        }

        commit('SET_USER', payload)
      } catch (error) {
        console.error('Failed to login', error);
      }
    },

    async storeEmailForgot({commit}, email) {
      try {
        const response = await setEmailForgot(email)

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        commit('EMAIL_FORGOT', response.data.data)
      } catch (error) {
        console.log('Failed to Send Email', error);
      }
    },

    async storeUserPassword({commit}, password) {
      try {
        const response = await setUserPassword(password)

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)
      } catch (error) {
        console.log('Failed to Change Password', error);
      }
    },

    async resendVerify({commit}, { params }) {
      try {
        const response = await resendVerification(params);

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)
      } catch (error) {
        console.error('Failed to resend verification', error);
      }
    },

    async updateFCM({commit}, params) {
      try {
        const response = await updateFCM(params);

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        localStorage.setItem("fcm_token", params.fcm)
        // console.log("UPDATE_FCM: ", params.fcm)
      } catch (error) {
        console.error('Failed to update fcm', error);
      }
    },

    async getAppVersion({ commit }) {
      try {
        const response = await apiCheckAppVersion()
        commit('SET_APP_VERSION', response?.data ?? null)
      } catch (error) {
        console.error('Failed to get app version:', error)
      }
    },

    async validateAppToken({ commit }) {
      try {
        const response = await apiValidateToken()
        commit('SET_APP_TOKEN_VALID', response?.data ?? false)
      } catch (error) {
        console.error('Failed to validate app token:', error)
        commit('SET_APP_TOKEN_VALID', false)
      }
    },

    async getUserDetail({ commit }) {
      try {
        const response = await apiAuthorize()
        const user = {
          id: response.data?.id ?? 0,
          name: response.data?.name ?? '',
          email: response.data?.email ?? '',
          kind: response.data?.kind ?? null,
          photo: response.data?.photo ?? null
        }

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('user_kind', user.kind)

        const payload = {
          user: user,
          access_token: localStorage.getItem('access_token'),
          user_kind: user.kind
        }

        commit('SET_USER', payload)
      } catch (error) {
        console.error('Failed to fetch user detail:', error)
      }
    },

    setUserRole({ commit, state }, { kind, type }) {
      try {
        const role = mapUserRole(kind)

        if (!type) {
          localStorage.setItem('user_kind', role)
          commit('SET_USER', {
            user: state.user,
            access_token: state.access_token,
            user_kind: role
          })
        }
      } catch (error) {
        console.error('Failed to set user role:', error)
      }
    },

    async getAppToken({commit}) {
      try {
        const response = await generateAppToken();

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        const appToken = response.data.data

        commit('SET_APP_TOKEN', appToken)

        // console.log("UPDATE_FCM: ", params.fcm)
      } catch (error) {
        console.error('Failed to get app token', error);
      }
    },

    async getCurrentSession({commit}) {
      try {
        const response = await checkSession();

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        const session = response.data.data

        commit('SET_SESSION', session)

        // console.log("UPDATE_FCM: ", params.fcm)
      } catch (error) {
        console.error('Failed to get app token', error);
      }
    },

    permission({ commit }, permission) {
        try {
            const resPayload = {
                message: "Success to set permission",
                status: true
            }

            commit('SET_RESPONSE', resPayload);
            commit('SET_PERMISSION', permission)
        } catch (error) {

            console.error("Failed to set permission:", error);
            const resPayload = {
                message: error,
                status: false
            }

            commit('SET_RESPONSE', resPayload);
        }
    },

    async logout({commit}) {
      try {
        const response = await logout()

        const resPayload = {
          message: response.data.message,
          status: response.data.status
        }

        commit('SET_RESPONSE', resPayload)

        if (response.data.status) {

          localStorage.clear()
          commit('LOGOUT', response)

        }
      } catch (error) {
        console.log('Failed to logout', error);
      }
    },
  }
}