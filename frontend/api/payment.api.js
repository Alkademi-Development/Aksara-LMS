import servicesClients from "./servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

const apiGetClassPayment = (slug) => servicesClients.get(BASE_URL_SERVICES + `v1/class/payment/invoice?slug=${slug}`)
const apiPostClassRepay = (slug) => servicesClients.get(BASE_URL_SERVICES + `v1/class/repay?slug=${slug}`)
const apiGetPayouts = (page, perPage, status, bank, search) => {
    const queryParams = new URLSearchParams();
  
    if (page) queryParams.append('page', page);
    if (perPage) queryParams.append('perPage', perPage);
    if (status) queryParams.append('status', status);
    if (bank) queryParams.append('bank', bank);
    if (search) queryParams.append('search', search);
  
    const queryString = queryParams.toString();
    return servicesClients.get(`${BASE_URL_SERVICES}v2/payout/list${queryString ? `?${queryString}` : ''}`);
  };
  
const apiGetBanks = () => servicesClients.get(BASE_URL_SERVICES + `v2/payout/banks`)
const apiGetBalance = () => servicesClients.get(BASE_URL_SERVICES + `v2/payout/balance`)

const apiRequestPayout = (payload) => servicesClients.post(BASE_URL_SERVICES + `v2/payout/request`, payload)
const apiApprovePayout = (payload) => servicesClients.post(BASE_URL_SERVICES + `v2/payout/approve`, payload)
const apiRejectPayout = (payload) => servicesClients.post(BASE_URL_SERVICES + `v2/payout/reject`, payload)

export {
    apiGetClassPayment,
    apiPostClassRepay,
    apiGetPayouts,
    apiRequestPayout,
    apiApprovePayout,
    apiRejectPayout,
    apiGetBanks,
    apiGetBalance
}