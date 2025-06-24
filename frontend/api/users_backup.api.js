import httpClient from './httpClient'
import authClient from './authClient'

import uploadClient from './uploadClient'

const BASE_URL = process.env.baseURL
const BASE_AUTH_URL = process.env.baseAuthURL

const apiGetUserDetail = (user_id) => httpClient.get(BASE_URL + `user/${user_id}/detail`)
const apiGetUserClassrooms = (user_id) => httpClient.get(BASE_URL + `user/${user_id}/classrooms`)
const apiGetUserTask = (page, user_id, class_id) => httpClient.get(BASE_URL + `user/${user_id}/classroom/${class_id}/tasks?page=${page}`)

const apiGetUsersRequest = (page) => httpClient.get(BASE_URL + `students/request?page=${page}`)
const apiGetUsersApproved = ({ page, search, programId, cityId, sortBy, sortType, studentStatus }) => {
    let url = `students?page=${page}`;
    if (search) url += `&search=${search}`;
    if (programId) url += `&programId=${programId}`;
    if (cityId) url += `&cityId=${cityId}`;
    if (sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    if (studentStatus != null) url += `&studentStatus=${studentStatus}`;
    return httpClient.get(BASE_URL + url);
}
const apiGetUsersApprovedBySchool = ({ page, search, programId, cityId, sortBy, sortType, studentStatus, schoolId }) => {
    let url = `school/${schoolId}/students?page=${page}`;
    if (search) url += `&search=${search}`;
    if (programId) url += `&programId=${programId}`;
    if (cityId) url += `&cityId=${cityId}`;
    if (sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    if (studentStatus != null) url += `&studentStatus=${studentStatus}`;
    return httpClient.get(BASE_URL + url);
}
const apiGetUserById = (id) => httpClient.get(BASE_URL + `student/${id}`)
const apiPostUser = (params) => httpClient.post(BASE_URL + `auth/register/students`, params)
const apiEditUser = (id, params) => uploadClient.post(BASE_URL + `student/${id}/edit`, params);
const getStudentByProgramId = ({program_id, page, search, cityId, sortBy, sortType}) => {
    let url = `program/${program_id}/students?page=${page}`;
    if (search) url += `&search=${search}`;
    if (cityId) url += `&cityId=${cityId}`;
    if (sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    return httpClient.get(BASE_URL + url);
}
const getStudentByBatchIdProgramId = ({batch_id, program_id, page, search, cityId, sortBy, sortType}) => {
    let url = `batch/${batch_id}/program/${program_id}/students?page=${page}`;
    if (search) url += `&search=${search}`;
    if (cityId) url += `&cityId=${cityId}`;
    if (sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    return httpClient.get(BASE_URL + url)
}
const getStudentByBatchIdRoundIdProgramId = ({ round_id, program_id, page, search, cityId, sortBy, sortType, studentStatus }) => {
    let url = `batch/round/${round_id}/program/${program_id}/students?page=${page}`;
    if (search) url += `&search=${search}`;
    if (cityId) url += `&cityId=${cityId}`;
    if (sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    if (studentStatus != null) url += `&studentStatus=${studentStatus}`;
    return httpClient.get(BASE_URL + url);
}
const getStudentRequestByProgramId = ({search, program_id, page, cityId, sortBy, sortType}) => {
    let url = `program/${program_id}/students/registrar?page=${page}`;
    if (search) url += `&search=${search}`;
    if (cityId) url += `&cityId=${cityId}`;
    if (sortBy && sortType) url += `&sort=${sortBy}&sortType=${sortType}`;
    return httpClient.get(BASE_URL + url);
}
const getDetailUserById = (user_id) => httpClient.get(BASE_URL + `user/${user_id}/detail`)
const apiBlockUser = (user_id) => httpClient.post(BASE_URL + `student/${user_id}/block`)

const getDetailUser = () => authClient.get(BASE_AUTH_URL + 'user/detail');

const apiGetMentors = ({page, programId}) => {
    let url = `mentors?page=${page}`;
    if (programId) url += `&programId=${programId}`
    return httpClient.get(BASE_URL + url)
}
const apiGetMentorById = (id) => httpClient.get(BASE_URL + `mentor/${id}`)
const apiPostMentor = (params) => httpClient.post(BASE_URL + `mentor`, params)
const apiEditMentor = (id, params) => uploadClient.post(BASE_URL + `mentor/${id}/edit`, params)
const apiBlockMentor = (mentor_id) => httpClient.post(BASE_URL + `mentor/${mentor_id}/block`)

const apiGetAdmins = (page) => httpClient.get(BASE_URL + `admins?page=${page}`)
const apiGetAdminById = (id) => httpClient.get(BASE_URL + `admin/${id}`)
const apiPostAdmin = (params) => httpClient.post(BASE_URL + `auth/register/admin`, params)
const apiEditAdmin = (id, params) => uploadClient.post(BASE_URL + `admin/${id}/edit`, params)
const apiBlockAdmin = (id) => httpClient.post(BASE_URL + `admin/${id}/block`)

const apiGetIndustries = (page) => httpClient.get(BASE_URL + `industries?page${page}`);
const apiPostIndustry = (params) => httpClient.post(BASE_URL + `auth/register/industry`, params)
const apiEditIndustry = (id, params) => uploadClient.post(BASE_URL + `industry/${id}/edit`, params);
const apiActivateIndustry = (id) => httpClient.post(BASE_URL + `industry/${id}/activate`);
const apiDeactivateIndustry = (id) => httpClient.post(BASE_URL + `industry/${id}/deactivate`);
const apiBlockIndustry = (id) => httpClient.post(BASE_URL + `industry/${id}/block`);

const apiSearchUser = (keyword) => httpClient.get(BASE_URL + `user/search/${keyword}`);
const apiDownloadCertificate = (batch_id, user_id) => httpClient.get(BASE_URL + `batch/${batch_id}/user/${user_id}/certificate`)
const apiGetDetailGlobal = (user_id) => httpClient.get(BASE_URL + `student/${user_id}/profile`)

export {
    apiGetUserDetail,
    apiGetUserClassrooms,
    apiGetUserTask,

    apiGetUsersRequest,
    apiGetUsersApproved,
    apiGetUsersApprovedBySchool,
    apiGetUserById,
    apiPostUser,
    apiEditUser,
    getStudentByProgramId,
    getStudentByBatchIdProgramId,
    getStudentByBatchIdRoundIdProgramId,
    getStudentRequestByProgramId,
    getDetailUserById,
    apiBlockUser,

    getDetailUser,

    apiGetMentors,
    apiGetMentorById,
    apiPostMentor,
    apiEditMentor,
    apiBlockMentor,

    apiGetAdmins,
    apiGetAdminById,
    apiPostAdmin,
    apiEditAdmin,
    apiBlockAdmin,

    apiGetIndustries,
    apiPostIndustry,
    apiEditIndustry,
    apiActivateIndustry,
    apiDeactivateIndustry,
    apiBlockIndustry,

    apiSearchUser,
    apiDownloadCertificate,
    apiGetDetailGlobal
}