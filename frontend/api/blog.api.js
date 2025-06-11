import httpClient from './httpClient';
;
import uploadClient from './uploadClient';

const BASE_URL = process.env.baseURL;

const apiGetBlogList = (page) => httpClient.get(BASE_URL + `blogs?page=${page}`);

const apiGetBlogDetail = (id) => httpClient.get(BASE_URL + `blog/${id}`);

const apiPostBlog = (params) => uploadClient.post(BASE_URL + 'blog', params);

const apiEditBlog = (id, params) => uploadClient.post(BASE_URL + `blog/${id}`, params);

const apiDeleteBlog = (id) => httpClient.post(BASE_URL + `blog/${id}/delete`);

export {
    apiGetBlogList,
    apiGetBlogDetail,
    apiPostBlog,
    apiEditBlog,
    apiDeleteBlog
}