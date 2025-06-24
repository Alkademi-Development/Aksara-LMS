import servicesClients from "../servicesClients"

const BASE_URL_SERVICES = process.env.servicesApi

const apiClassroomListModulesV3 = (classroomSlug, keyword = null, sort = null) => {
  let url = `v3/class/module/list?classroomSlug=${classroomSlug}`
  if (keyword) url += `&keyword=${keyword}`
  if (sort) url += `&sort=${sort}`
  return servicesClients.get(BASE_URL_SERVICES + url)
}
const apiClassroomRemoveModuleV3 = (classroomSlug, moduleUUID) => servicesClients.post(BASE_URL_SERVICES + `v3/class/module/remove?classroomSlug=${classroomSlug}&moduleUUID=${moduleUUID}` )
const apiDetailModuleV3 = (classroomSlug, moduleUUID) => servicesClients.get(BASE_URL_SERVICES + `v3/class/module/detail?classroomSlug=${classroomSlug}&moduleUUID=${moduleUUID}`);

const apiClassroomModuleCounterV3 = (classroomSlug, moduleSlug, userId) => servicesClients.get(BASE_URL_SERVICES + `v3/class/module/counter?classroomSlug=${classroomSlug}&moduleSlug=${moduleSlug}&userId=${userId}`);
const apiClassroomModuleCounterListV3 = (classroomSlug, userId) => servicesClients.get(BASE_URL_SERVICES + `v3/class/module/list-counter?classroomSlug=${classroomSlug}&userId=${userId}`);

const apiListTopicsV3 = (classroomSlug, moduleUUID) => servicesClients.get(BASE_URL_SERVICES + `v3/class/topic/list?classroomSlug=${classroomSlug}&moduleUUID=${moduleUUID}`);
const apiDetailTopicV3 = (classroomSlug, topicUUID) => servicesClients.get(BASE_URL_SERVICES + `v3/class/topic/detail?classroomSlug=${classroomSlug}&topicUUID=${topicUUID}`);

const apiUnlockTopicV3 = (classroomSlug, topicUUID, completed) => {
  let endpoint = `${BASE_URL_SERVICES}v3/class/topic/unlock?`;

  if(classroomSlug) endpoint += `&classroomSlug=${classroomSlug}`;
  if(topicUUID) endpoint += `&topicUUID=${topicUUID}`;
  if(completed) endpoint += `&completed=${completed}`;

  return servicesClients.get(endpoint);
};

const apiUnlockModuleV3 = (classroomSlug, moduleUUID) => servicesClients.get(BASE_URL_SERVICES + `v3/class/module/unlock?classroomSlug=${classroomSlug}&moduleUUID=${moduleUUID}`);

export {
  apiClassroomModuleCounterV3,
  apiClassroomModuleCounterListV3,
  apiClassroomListModulesV3,
  apiClassroomRemoveModuleV3,
  apiDetailModuleV3,
  apiListTopicsV3,
  apiDetailTopicV3,
  apiUnlockTopicV3,
  apiUnlockModuleV3,
}
