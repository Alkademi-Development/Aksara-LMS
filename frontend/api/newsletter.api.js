import servicesClients from "./servicesClients";

const BASE_URL_SERVICES = process.env.servicesApi

const apiGetNewsletterList = ({
  page,
  pageSize,
  filter
}) => {
  const url = 'v0/cms/newsletter/list';

  const _page = !!page ? `&page=${page}` : ''
  const _pageSize = !!pageSize ? `&pageSize=${pageSize}` : ''
  const _filter = !!filter ? `&filter=${filter}` : '';

  const queries = '?' + _page + _pageSize + _filter;

  return servicesClients.get(BASE_URL_SERVICES + url + queries)
};

const apiGetNewsletterDetail = (slug) => servicesClients.get(BASE_URL_SERVICES + `v0/cms/newsletter/detail?slug=${slug}`);

const apiPostNewsletter = (params) => servicesClients.post(BASE_URL_SERVICES + 'v0/cms/newsletter/create', params);

const apiUnsubsNewsletter = () => servicesClients.post(BASE_URL_SERVICES + 'v0/cms/newsletter/unsubs');

const apiImportNewsletterV2 = (file) => {
  return servicesClients.post(BASE_URL_SERVICES + `v0/newsletter/import`, file, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  });
}

export {
  apiGetNewsletterList,
  apiGetNewsletterDetail,
  apiPostNewsletter,
  apiUnsubsNewsletter,
  apiImportNewsletterV2,
}