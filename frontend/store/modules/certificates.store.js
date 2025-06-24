import { getCertificatesStudents, getDetailRaport, getDetailCertificate } from "@/api/certificates.api"
import DOMAIN from "@/api/app-token";

export default {
  namespaced: true,
  state: {
    certificates: [],
    raport: {},
    message: '',
    status: false
  },
  mutations: {
    SET_RESPONSE(state, {message, status}){
      state.message = message;
      state.status = status;
    },
    SET_CERTIFICATES(state, {certificates}){
      state.certificates = certificates
    },
    SET_RAPORT(state, raport){
      state.raport = raport
    },
  },
  actions: {
    async fetchCertificatesStudents({ commit }) {
      const response = await getCertificatesStudents()

      const resPayload = {
        message: response?.data?.message,
        status: response?.data?.status
      }
      const payload = {
        certificates: response.data.data
      }

      commit('SET_CERTIFICATES', payload)
      commit('SET_RESPONSE', resPayload)
    },

    fetchDetailRaport: async ({commit}, {userId, classroomId}) => {
      const response = await getDetailRaport(userId, classroomId)
      let resPayload = {}
      let payload = {}

      if (
        response?.data?.data?.Class === 'Radya Fellowship' ||
        DOMAIN?.DOMAIN === 'umptn.alkademi.id' || 
        DOMAIN?.DOMAIN === 'jambore.informatika.org'
      ) {
        payload = {
          raport: null
        }

        resPayload = {
          message: 'Halaman sertifikat masih belum tersedia',
          status: false
        }

        return commit('SET_RESPONSE', resPayload)
      }
      
      resPayload = {
        message: response?.data?.message,
        status: response?.data?.status
      }
      
      payload = {
        raport: response?.data?.data
      }
      
      commit('SET_RESPONSE', resPayload)
      commit('SET_RAPORT', payload)
    },
    fetchDetailCertificate: async ({commit}, {userId, classroomId}) => {
      const response = await getDetailCertificate(userId, classroomId)
      let resPayload = {}
      let payload = {}

      if (
        response?.data?.data?.Class === 'Radya Fellowship' ||
        DOMAIN?.DOMAIN === 'umptn.alkademi.id' || 
        DOMAIN?.DOMAIN === 'jambore.informatika.org'
      ) {
        payload = {
          raport: null
        }

        resPayload = {
          message: 'Halaman sertifikat masih belum tersedia',
          status: false
        }

        return commit('SET_RESPONSE', resPayload)
      }
      
      resPayload = {
        message: response?.data?.message,
        status: response?.data?.status
      }
      
      payload = {
        raport: response?.data?.data
      }
      
      commit('SET_RESPONSE', resPayload)
      commit('SET_RAPORT', payload)
    }
  }
}