import servicesClients from "./servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

const apiGetPosts = (page, kind) => {
    const url = `v1/post/list`

    const tempPage = !!page ? `page=${page}` : ''
    const tempKind = !!kind ? `&kind=${kind}` : ''
    // const tempKeyword = !!keyword ? `&keyword=${keyword}` : ''

    const params = '?' + tempPage + tempKind

    return servicesClients.get(BASE_URL_SERVICES + url + params)
}

const apiGetDetailPost = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/post/detail?id=${id}`);
const apiGetDetailPostV2 = (slug) => servicesClients.get(BASE_URL_SERVICES + `v2/post/detail?slug=${slug}`);

const apiCreatePost = (body) => servicesClients.post(BASE_URL_SERVICES + 'v1/post/create', body)

const apiEditPost = (postId, body) => servicesClients.post(BASE_URL_SERVICES + `v1/post/update?id=${postId}`, body)

const apiDeletePost = (id) => servicesClients.get(BASE_URL_SERVICES + `v1/post/delete?id=${id}`)

export {
    apiGetPosts,
    apiGetDetailPost,
    apiCreatePost,
    apiEditPost,
    apiDeletePost,
    apiGetDetailPostV2
}