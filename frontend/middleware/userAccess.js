import UserAccess from "@/commons/constants/userAccess"
import appToken from "../api/app-token"
import { apiGetLmsId } from '../api/sass.api'

export default function ({ route, store, redirect, next }) {
    const user_kind = store.state.Auth.user_kind
    const route_name = route.name
    const user_access = UserAccess?.[user_kind]

    // If the user is not authenticated
    if (store.state.Auth.access_token == null || '') {
        const baseUrl = process.env.alkademiAuth;

        const redirect = "&redirectTo=" + window.location.origin;
        const backTo = "&backTo=" + window.location.href;

        apiGetLmsId("v0").then(lmsId => {
            appToken?.getCode().then(code => {
                appToken.generatedToken().then(_generatedToken => {
                    setTimeout(async() => {
                        const codeToken = `&code=${await appToken?.getCode()}`
                        const generatedToken = `&generatedToken=${await appToken.generatedToken()}`

                        const fullPath = window.location.href
                        const queryToken = route.query?.authToken
                        if (!fullPath.toLowerCase().includes('callbackauth') && !!queryToken) {
                            // const url = fullPath.split('dashboard')[0] + `callbackAuth?authToken=${queryToken}&redirectTo=${fullPath.split('?')[0]}`
                            const url = `${baseUrl}/auth?${redirect}&lmsId=${lmsId.data.data}${codeToken}${generatedToken}&authToken=${queryToken}&backTo=${fullPath.split('?')[0]}`

                            return window.open(url, "_self")
                        }


                        const url = `${baseUrl}/auth?${redirect}&lmsId=${lmsId.data.data}${codeToken}${generatedToken}${backTo}`;
                        return window.open(url, "_self")
                    }, 400)
                })
            })
        })
    }

    if (!!user_access && !!route_name) {

        if (user_kind === 'superadmin' || user_kind === 'admin') {

            return store.dispatch('Auth/permission', true)

        } else {

            const accessAllowed = (element) => {
                return element?.toLowerCase() === route_name?.toLowerCase();
            }

            if (user_access.findIndex(accessAllowed) < 0) {

                return store.dispatch('Auth/permission', false)

            } else {

                return store.dispatch('Auth/permission', true)

            }
        }
    } else {

        return store.dispatch('Auth/permission', true)

    }
}