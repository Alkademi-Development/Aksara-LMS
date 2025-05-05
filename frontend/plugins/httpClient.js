import { httpClient } from '@/utils/httpClient'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()  
    httpClient.init(config.public.servicesApi)
})
