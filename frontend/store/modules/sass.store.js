import {
    apiGetAllSettings,
} from "@/api/sass.api"

export default {
    namespaced: true,
    state: () => ({
        status: false,
        isTestCase: false,
        isSchoolCase: false,
        message: '',
        data: null,
        settings: {
            "css": {
                "clr_danger": "#f5365c",
                "clr_dark": "#212529",
                "clr_info": "#11cdef",
                "clr_light": "#adb5bd",
                "clr_primary": "#2096C4",
                "clr_secondary": "#ffb845",
                "clr_success": "#2dce89",
                "clr_warning": "#fb6340",
                "ft_primary": "Urbanist",
                "ft_secondary": "Open Sans"
            },
            "favicon": "https://drive.alkademi.id/v1/upload/themes/static/assets/img/logos/alkademi-fav.png",
            "helpdesk": "",
            "isLevelingCase": "",
            "isMaintenance": false,
            "isTestCase": false,
            "layout": "alkademi",
            "listMenu": [
                "dashboard",
                "schedules",
                "user",
                "program",
                "module",
                "class",
                "tasks",
                "scores",
                "certificate",
                "raport",
                "blogs",
                "program-akselerasi",
                "career",
                "announcement-akselerasi",
                "galleries",
                "form",
                "studio",
                "achievement",
                "newsletters"
            ],
            "logo_dark": "https://drive.alkademi.id/v1/upload/settings/alkademi/1740982343140.png",
            "logo_light": "https://drive.alkademi.id/v1/upload/settings/alkademi/1740982547242.png",
            "meta": {
                "card": "summary_large_image",
                "description": "Empower your digital career with our bootcamp, where AI-driven strategies and expert mentorship deliver global work opportunities.",
                "image": "https://drive.alkademi.id/v1/upload/settings/alkademi/1740982343140.png",
                "keywords": "Expert Bootcamp, AI-Powered Bootcamp, Software Engineering Bootcamp, AI Training for Software Engineers, Digital Talent Upskilling, ASEAN's Talent, ASIA's Talent, Global Talent, Indonesia's Talents, Job Placement, Talent Mathing",
                "name": "Alkademi - Accelerate Your Global Digital Career with Artificial Intelligence",
                "site_name": "Alkademi - Accelerate Your Global Digital Career with Artificial Intelligence",
                "twitter_site": "https://alkademi.id/",
                "type": "website",
                "url": "https://alkademi.id/"
            },
            "title": "Alkademi - Accelerate Your Global Digital Career with Artificial Intelligence"
        },
        appVersion: null,
        isTokenValid: false,
        exchangeToken: null
    }),
    mutations: {
        SET_RESPONSE(state, { message, status }) {
            state.message = message
            state.status = status
        },
        SET_DATA(state, data){
            state.data = data
        },
        SET_SETTINGS(state, settings){
            state.settings = settings
        },
        SET_APP_VERSION(state, version) {
            state.appVersion = version
        },
    },
    actions: {
        async allSettings ({ commit }, { version }) {
            try {
                const response = await apiGetAllSettings(version)

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                let data = response?.data?.data;

                commit('SET_RESPONSE', resPayload);
                commit('SET_SETTINGS', data)

            } catch (error) {
                console.error("Failed to get all sass settings:", error);
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        }
    }
}