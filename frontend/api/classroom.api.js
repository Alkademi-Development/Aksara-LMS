import httpClient from './httpClient'
import httpClientExport from './httpClientExport'
import uploadClient from './uploadClient'

const BASE_URL = process.env.baseURL;

const apiCreateClassroom = (params) => httpClient.post(BASE_URL + `classroom`, params);

const apiGetClassroomList = (page) => httpClient.get(BASE_URL + `classrooms?page=${page}`);

const apiGetActiveClassroom = () => httpClient.get(BASE_URL + 'classroom/active');

const apiGetClassroomDetail = (id) => httpClient.get(BASE_URL + `classroom/${id}`);

const apiEditClassroom = (id, params) => httpClient.post(BASE_URL + `classroom/${id}/edit`, params);

const apiStartClassroom = (id, params) => httpClient.post(BASE_URL + `classroom/${id}/meet`, params);

const apiGetClassroomModuleTasks = (classroom_id, module_id, page) => httpClient.get(BASE_URL + `classroom/${classroom_id}/module/${module_id}/tasks?page=${page}`);

const apiGetClassroomTaskDetail = (classroom_id, module_id, student_id) => httpClient.get(BASE_URL + `classroom/${classroom_id}/module/${module_id}/student/${student_id}/task`);

const apiStudentAssignTask = (classroom_id, module_id, params) => uploadClient.post(BASE_URL + `classroom/${classroom_id}/module/${module_id}/task/assign`, params);

const apiMentorVerifyTask = (classroom_id, module_id, student_id, params) => httpClient.post(BASE_URL + `classroom/${classroom_id}/module/${module_id}/student/${student_id}/task/verify`, params)

const apiGenerateClassrooms = (params) => httpClient.post(BASE_URL + `classrooms/generate`, params)

const apiCreateUserEditor = (params) => httpClient.post(BASE_URL + `user/editor`, params)

const apiGetStudentTaskList = (page, student_id) => httpClient.get(BASE_URL + `classroom/student/${student_id}/tasks?page=${page}`)

const apiAddForm = (classroomId, moduleId, params) => httpClient.post(BASE_URL + `classroom/${classroomId}/module/${moduleId}/form`, params)

const apiFormRespondents = (formId) => httpClient.get(BASE_URL + `classroom/module/form/${formId}`)

const apiCekGenerateClass = () => httpClient.get(BASE_URL + `classrooms/student/ungenerated`)

const apiStartFormAnswer = (classroomId, moduleId) => httpClient.post(BASE_URL + `classroom/${classroomId}/module/${moduleId}/form/start`)

const apiGetProgress = () => httpClient.get(BASE_URL + `classroom/progress`)

const apiLeaderboards = (classroomId) => httpClient.get(BASE_URL + `classroom/${classroomId}/leaderboards`)

const apiLeaderboardsExport = (classroomId) => httpClientExport.get(BASE_URL + `classroom/${classroomId}/leaderboards/export`)

export {
    apiGetClassroomList,
    apiGetActiveClassroom,
    apiGetClassroomDetail,
    apiEditClassroom,
    apiStartClassroom,
    apiGetClassroomModuleTasks,
    apiGetClassroomTaskDetail,
    apiStudentAssignTask,
    apiMentorVerifyTask,
    apiGenerateClassrooms,
    apiCreateUserEditor,
    apiGetStudentTaskList,
    apiAddForm,
    apiFormRespondents,
    apiCekGenerateClass,
    apiCreateClassroom,
    apiStartFormAnswer,
    apiGetProgress,
    apiLeaderboards,
    apiLeaderboardsExport
};