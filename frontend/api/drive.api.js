import servicesClients from "./servicesClients"

const BASE_URL = process?.env?.baseUrlDrive

const apiGetDriveAssets = (path) => servicesClients.get(BASE_URL + `v1/${path}`)
const apiUploadDriveAssets = (params) => servicesClients.post(BASE_URL + `v1/upload`, params)

export {
   apiGetDriveAssets,
   apiUploadDriveAssets
}