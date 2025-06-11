import httpClient from './httpClient';

const BASE_URL = process.env.baseURL;

const apiGetAnnouncementList = (page) => httpClient.get(BASE_URL + `announcements/dashboard?page=${page}`);

const apiGetAnnouncementAuth = (page) => httpClient.get(BASE_URL + `announcements`);

const apiGetAnnouncementDetail = (id) => httpClient.get(BASE_URL + `announcement/${id}`);

const apiPostAnnouncement = (params) => httpClient.post(BASE_URL + 'announcement', params);

const apiEditAnnouncement = (id, params) => httpClient.post(BASE_URL + `announcement/${id}`, params);

const apiDeleteAnnouncement = (id) => httpClient.post(BASE_URL + `announcement/${id}/delete`);

export {
    apiGetAnnouncementList,
    apiGetAnnouncementAuth,
    apiGetAnnouncementDetail,
    apiPostAnnouncement,
    apiEditAnnouncement,
    apiDeleteAnnouncement,
}