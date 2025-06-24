import servicesClients from "../servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

const apiTopicsV2 = (page, moduleSlug) => {
    var params = ''
    if (page) params += `&page=${page}`
    if (moduleSlug) params += `&moduleSlug=${moduleSlug}`
    return servicesClients.get(BASE_URL_SERVICES + `v2/module/topic/list?${params}`)
}

const apiDownloadTopicV2 = (slug) => servicesClients.get(BASE_URL_SERVICES + `v2/module/topic/download?slug=${slug}`, {
    responseType: "blob",
});
const apiImportTopicV2 = (file) => {
    return servicesClients.post(BASE_URL_SERVICES + `v2/module/topic/import`, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const apiGetDetailTopicV2 = (slug) => servicesClients.get(BASE_URL_SERVICES + `v2/module/topic/detail?slug=${slug}`);
const apiEditTopicV2 = (topicSlug, payload) => servicesClients.post(BASE_URL_SERVICES + `v2/module/topic/edit?slug=${topicSlug}`, payload);
const apiDeleteTopicV2 = (topicSlug) => servicesClients.get(BASE_URL_SERVICES + `v2/module/topic/delete?slug=${topicSlug}`);
const apiDetailModuleV2 = (slug) => servicesClients.get(BASE_URL_SERVICES + `v2/module/detail?slug=${slug}`);

const apiAssignBundleToLMS = (bundleSlug) => servicesClients.post(BASE_URL_SERVICES + `v2/module/bundle/lms/assign?slug=${bundleSlug}`);

const apiGetListBundleRelated = (bundleSlug) => servicesClients?.get(BASE_URL_SERVICES + `v2/module/bundle/list/related?slug=${bundleSlug}`);

export {
    apiTopicsV2,
    apiGetDetailTopicV2,
    apiEditTopicV2,
    apiDeleteTopicV2,
    apiDetailModuleV2,
    apiAssignBundleToLMS,
    apiGetListBundleRelated,
    apiDownloadTopicV2,
    apiImportTopicV2
}
