import formClients from "./formClients"

const BASE_URL_SERVICES = process.env.servicesApi

// Forms
const apiGetAllForms = () => formClients.get(BASE_URL_SERVICES + `v1/form/forms/all`)
const apiCreateForm = (params) => formClients.post(BASE_URL_SERVICES + `v1/form/form/create`, params)
const apiFormDetail = (id) => formClients.get(BASE_URL_SERVICES + `v1/form/form/detail?formId=${id}`)
const apiEditForm = (id, params) => formClients.post(BASE_URL_SERVICES + `v1/form/form/edit?formId=${id}`, params)
const apiDeleteForms = (id) => formClients.post(BASE_URL_SERVICES + `v1/form/form/delete?formId=${id}`)

const apiGetForms = (page, kind, keyword) => {
    let url = `v1/form/forms`

    const tempPage = !!page ? `page=${page}` : ''
    const tempKind = !!kind ? `&kind=${kind}` : ''
    const tempKeyword = !!keyword ? `&search=${keyword}` : ''

    const params = '?' + tempPage + tempKind + tempKeyword

    return formClients.get(BASE_URL_SERVICES + url + params)
}

// Categories
const apiCategories = (page) => formClients.get(BASE_URL_SERVICES + `v1/form/question/categories${page ? '?page='+page : ''}`)
const apiCreateCategories = (params) => formClients.post(BASE_URL_SERVICES + `v1/form/question/category/create`, params)
const apiDetailCategories = (id) => formClients.post(BASE_URL_SERVICES + `v1/form/question/category/detail?categoryId=${id}`)
const apiEditCategories = (id, params) => formClients.post(BASE_URL_SERVICES + `v1/form/question/category/edit?categoryId=${id}`, params)
const apiDeleteCategories = (id) => formClients.post(BASE_URL_SERVICES + `v1/form/question/category/delete?categoryId=${id}`)

// Questions
const apiFormQuestion = (id, page) => formClients.get(BASE_URL_SERVICES + `v1/form/questions?formId=${id}&page=${page}`)
const apiFormAddQuestion = (formId, params) => formClients.post(BASE_URL_SERVICES + `v1/form/question/add?formId=${formId}`, params)
const apiFormDetailQuestion = (formId, questionId) => formClients.get(BASE_URL_SERVICES + `v1/form/question/detail?formId=${formId}&questionId=${questionId}`)
const apiFormEditQuestion = (formId, questionId, params) => formClients.post(BASE_URL_SERVICES + `v1/form/question/edit?formId=${formId}&questionId=${questionId}`, params)
const apiFormDeleteQuestion = (formId, questionId) => formClients.post(BASE_URL_SERVICES + `v1/form/question/delete?formId=${formId}&questionId=${questionId}`)


export {
    apiGetAllForms,
    apiCreateForm,
    apiFormDetail,
    apiEditForm,
    apiGetForms,
    apiDeleteForms,
    apiCategories,
    apiCreateCategories,
    apiDetailCategories,
    apiEditCategories,
    apiDeleteCategories,
    apiFormQuestion,
    apiFormAddQuestion,
    apiFormDetailQuestion,
    apiFormEditQuestion,
    apiFormDeleteQuestion
}
