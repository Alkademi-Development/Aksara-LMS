;
import httpClient from './httpClient';
import uploadClient from './uploadClient';

const BASE_URL = process.env.baseURL;

const apiGetGalleryList = (page) => httpClient.get(BASE_URL + `galleries?page=${page}`);

const apiGetGalleryDetail = (id) => httpClient.get(BASE_URL + `gallery/${id}`);

const apiPostGallery = (params) => uploadClient.post(BASE_URL + 'gallery', params);

const apiEditGallery = (id, params) => uploadClient.post(BASE_URL + `gallery/${id}`, params);

const apiDeleteGallery = (id) => httpClient.post(BASE_URL + `gallery/${id}/delete`);

export {
    apiGetGalleryList,
    apiGetGalleryDetail,
    apiPostGallery,
    apiEditGallery,
    apiDeleteGallery
}