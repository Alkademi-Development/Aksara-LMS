import httpClient from "./httpClient"
import servicesClients from "./servicesClients";

const BASE_URL = process.env.baseURL;
const BASE_SERVICES_URL = process.env.servicesApi

const downloadCertificateById = (batch_id, user_id) => httpClient.get(BASE_URL + `test/batch/${batch_id}/user/${user_id}/certificate`)
const downloadCertificateByToken = (token) => httpClient.get(BASE_URL + `batch/${batch_id}/certificate?token=${token}`)

const getCertificatesStudents = () => httpClient.get(BASE_URL + `certificates`)
// const getDetailRaport = (userId, classroomId) => servicesClients.get(BASE_SERVICES_URL + `v1/class/certificate/rapor/detail?userId=${userId}&classroomId=${classroomId}`)
const getDetailRaport = (userId, classroomId) => servicesClients.get(BASE_SERVICES_URL + `v1/class/rapor/detail?userId=${userId}&classroomId=${classroomId}`)
const getDetailCertificate = (userId, classroomId) => servicesClients.get(BASE_SERVICES_URL + `v1/class/certificate/detail?userId=${userId}&classroomId=${classroomId}`)

export {
  downloadCertificateById,
  downloadCertificateByToken,
  getCertificatesStudents,
  getDetailRaport,
  getDetailCertificate,
}