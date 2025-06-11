import httpClient from './httpClient'
import uploadClient from './uploadClient'

const BASE_URL = process.env.baseURL;

const apiGetUserBid = () => httpClient.get(BASE_URL + 'projects/bids');

const apiGetProjects = (page) => httpClient.get(BASE_URL + `projects?page=${page}`);

const apiGetProjectsAvailable = (page) => httpClient.get(BASE_URL + `projects/available?page=${page}`);

const apiGetProjectDetail = (id) => httpClient.get(BASE_URL + `project/${id}`);

const apiPostProject = (params) => httpClient.post(BASE_URL + 'project', params);

const apiBidProject = (id, params) => uploadClient.post(BASE_URL + `project/${id}/bid`, params);

const apiApproveProject = (project_id, user_id) => httpClient.post(BASE_URL + `project/${project_id}/user/${user_id}/approve`);

const apiEditProject = (id, params) => httpClient.post(BASE_URL + `project/${id}/edit`, params);

const apiDeleteProject = (id) => httpClient.post(BASE_URL + `project/${id}/delete`);

const apiSearchJobs = (keyword) => httpClient.get(BASE_URL + `jobs/${keyword}`);

export {
    apiGetUserBid,
    apiGetProjects,
    apiGetProjectsAvailable,
    apiGetProjectDetail,
    apiPostProject,
    apiBidProject,
    apiApproveProject,
    apiEditProject,
    apiDeleteProject,
    apiSearchJobs,
}