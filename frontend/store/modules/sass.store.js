import {
    apiGetLmsId,
    apiGetAllSettings,
    apiGetSettingByKey,
    apiUpdateAllSettings,
    apiUpdateSettingByKey,
    apiZoomPlatform,
    apiUpdateZoomPlatform,
    apiGmeetPlatform,
    apiUploadGmeetCredentials,
    apiUpdateGmeetPlatform,
    apiGenerateAppToken,
    apiCheckAppVersion,
    apiValidateToken,
    apiAuthorizeTokenExchange,
} from "@/api/sass.api"

export default {
    namespaced: true,
    state: {
        status: false,
        isTestCase: false,
        isSchoolCase: false,
        message: '',
        data: null,
        settings: null,
        appVersion: null,
        isTokenValid: false,
        exchangeToken: null
    },

    mutations: {
        SET_RESPONSE(state, { message, status }){
            state.message = message
            state.status = status
        },
        SET_DATA(state, data){
            state.data = data
        },
        SET_TOKEN_EXCHANGE(state, data){
            state.exchangeToken = data
        },
        SET_SETTINGS(state, settings){
            state.settings = settings
        },
        SET_TESTCASE(state, data){
            state.isTestCase = data
        },
        SET_SCHOOLCASE(state, data){
            state.isSchoolCase = data
        },
        SET_APP_VERSION(state, version) {
            state.appVersion = version
        },
        SET_TOKEN_STATUS(state, status) {
            state.isTokenValid = status
        },
    },

    actions: {
        async lmsId ({commit}, {version}) {
            try {
                const response = await apiGetLmsId(version)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                localStorage.setItem('lmsId', response.data.data)

            } catch (error) {
                console.error("Failed to get sass lms id:", error);
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async allSettings ({commit}, {version}) {
            try {
                const response = await apiGetAllSettings(version)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                let data = response.data.data
                let isTestCase = data.isTestCase ?? false
                let isSchoolCase = data.isSchoolCase ?? false

                /**
                 * Handle List Menu By Case
                 */
                let listMenu = data.listMenu

                let arrayRemove = (arr, value) => arr.filter(function(ele) { return ele != value })

                // listMenu = arrayRemove(listMenu, 'test')
                // listMenu = arrayRemove(listMenu, 'class')
                listMenu = arrayRemove(listMenu, 'schools')

                // Handle Test or Class Menu
                // if (isTestCase) listMenu.push('test')
                // else listMenu.push('class')

                // Handle School Menu
                if (isSchoolCase) listMenu.push('schools')

                data.listMenu = listMenu

                /**
                 * Commit Data
                 */
                commit('SET_TESTCASE', isTestCase)
                commit('SET_SCHOOLCASE', isSchoolCase)

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
        },
        async settingByKey ({commit}, {version, key}) {
            try {
                const response = await apiGetSettingByKey(version, key)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to get sass setting by key:", error);
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async editAllSettings ({commit}, {version, params}) {
            try {
                const response = await apiUpdateAllSettings(version, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to edit all sass settings:", error);
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async editSettingByKey ({commit}, {version, key, params}) {
            try {
                const response = await apiUpdateSettingByKey(version, key, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to edit sass setting by key:", error);
                const resPayload = {
                    message: error,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async zoom ({commit}) {
            try {
                const response = await apiZoomPlatform()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to get detail zoom platform:", error);
                const resPayload = {
                    message: `Failed to get detail zoom platform: ${error}`,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async updateZoom ({commit}, params) {
            try {
                const response = await apiUpdateZoomPlatform(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to update zoom platform:", error);
                const resPayload = {
                    message: `Failed to update zoom platform: ${error}`,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async gmeet ({commit}) {
            try {
                const response = await apiGmeetPlatform()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to get detail gmeet platform:", error);
                const resPayload = {
                    message: `Failed to get detail gmeet platform: ${error}`,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async uploadGmeetCredentials ({commit}, params) {
            try {
                const response = await apiUploadGmeetCredentials(params?.redirectUri, params?.params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to upload gmeet credentials:", error);
                const resPayload = {
                    message: `Failed to upload gmeet credentials: ${error}`,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async updateGmeet ({commit}, params) {
            try {
                const response = await apiUpdateGmeetPlatform(params?.code, params?.redirectUri)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to update gmeet platform:", error);
                const resPayload = {
                    message: `Failed to update gmeet platform: ${error}`,
                    status: false
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
        async generateAppToken ({commit}, params) {
            try {
                const response = await apiGenerateAppToken(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }               

                commit('SET_RESPONSE', resPayload)

                commit('SET_DATA', response.data.data)

            } catch (error) {
                console.error("Failed to generate app token:", error)
                const resPayoad = {
                    message: `Failed to generate app token: ${error}`,
                    status: false
                }

                document.cookie = "_ift=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

                commit('SET_RESPONSE', resPayoad)
            }
        },
        async postAuthorizeTokenExchange ({commit}, params) {
            try {
                const res = await apiAuthorizeTokenExchange(params)

                /* 
                Mock authorize token exchange
                */
                // const res = await new Promise((resolve, reject) => {
                // setTimeout(() => {
                //     const mockResponse = {
                //         data: {
                //             data: {
                //                 expiry: "2024-09-19T03:39:16",
                //                 token: "cf370172bd44e296:cc992661023f7a5723e544ce8afd4e7b4ffda3a17441aa34025ad3b1ec214e08fbf29d850e484f6e7a"
                //             },
                //             message: "Success authorize token exchange",
                //             status: true
                //         }
                //     };
                //     resolve(mockResponse);
                //     }, 1000); // Simulate 1 second delay
                // })

                console.log({res});

                commit('SET_RESPONSE', {status: res.data.status, message: res.data.message})
                commit('SET_TOKEN_EXCHANGE', res.data.data)
            } catch (error) {
                console.error("Failed to authorize token exchange:", error)
                const resPayoad = {
                    message: `Failed to authorize token exchange: ${error}`,
                    status: false
                }

                document.cookie = "_ift=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

                commit('SET_RESPONSE', resPayoad)
            }
        },
        async checkAppVersion({ commit }) {
            try {
                const response = await apiCheckAppVersion()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                };

                commit("SET_RESPONSE", resPayload)

                commit("SET_APP_VERSION", response.data.data)

            } catch (error) {
                console.log("Failed to check app version:", error);
                const resPayload = {
                    message: error,
                    status: false,
                };

                commit("SET_RESPONSE", resPayload);
            }
        },

        async validateAppToken({ commit }) {
            try {
                const response = await apiValidateToken()

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status,
                };

                commit("SET_RESPONSE", resPayload)

                commit("SET_TOKEN_STATUS", response.data.data)

            } catch (error) {
                console.log("Failed to validate app token:", error);
                const resPayload = {
                    message: error,
                    status: false,
                };

                commit("SET_RESPONSE", resPayload);
            }
        },
    }
}