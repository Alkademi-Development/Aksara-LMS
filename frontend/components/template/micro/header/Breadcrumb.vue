<template>
    <nav :class="['d-flex flex-row align-items-center', containerClass]" aria-label="breadcrumb">
        <BackButton
            v-if="showBackButton"
            title=""
        />

        <template v-if="!isMobile">
            <div
                class="d-flex flex-row align-items-center mr-2" 
                v-for="(route, idx) in breadcrumbs" 
                :key="idx"
            >
                <nuxt-link 
                        class="font-small mr-2 text-limit limit-1 breadcrumb-limit"
                        v-if="idx !== breadcrumbs?.length - 1" 
                        :to="{
                            path: route?.route,
                            query: idx == 0 ? {  } : idx == 1 ? {  } : {id: $route.query.id}
                        }"
                    >
                    {{ route?.name | translateTitle }}
                </nuxt-link>
    
                <span class="font-small text-primary text-limit limit-1 breadcrumb-limit" v-else>
                    {{ route?.name | translateTitle }}
                </span>
    
                <i v-if="idx !== breadcrumbs?.length - 1" class="ri-arrow-right-s-line"></i>
            </div>
        </template>
        <template v-else>
            <template v-for="(route, idx) in breadcrumbs">
                <div
                    v-if="idx !== breadcrumbs?.length - 1 && breadcrumbs?.length <= 2"
                    class="d-flex flex-row align-items-center mr-2" 
                    :key="idx"
                >
                    <nuxt-link 
                            class="font-small mr-2 text-limit limit-1 breadcrumb-limit"
                            v-if="idx !== breadcrumbs?.length - 1 && breadcrumbs?.length <= 2" 
                            :to="{
                                path: route?.route,
                                query: idx == 0 ? {  } : idx == 1 ? {  } : {id: $route.query.id}
                            }"
                        >
                        {{ route?.name | translateTitle }}
                    </nuxt-link>
        
                    <span v-if="breadcrumbs.length >= 2 && idx == breadcrumbs.length - 1" class="font-small text-primary text-limit limit-1 breadcrumb-limit">
                        {{ route?.name | translateTitle }}
                    </span>
    
                    <i v-if="idx !== breadcrumbs?.length - 1 && breadcrumbs?.length <= 2" class="ri-arrow-right-s-line"></i>
                </div>
                <div
                    v-else-if="breadcrumbs.length >= 2 && idx == breadcrumbs.length - 1"
                    class="d-flex flex-row align-items-center mr-2" 
                    :key="idx"
                >
                    <nuxt-link 
                            class="font-small mr-2 text-limit limit-1 breadcrumb-limit"
                            v-if="idx !== breadcrumbs?.length - 1 && breadcrumbs?.length <= 2" 
                            :to="{
                                path: route?.route,
                                query: idx == 0 ? {  } : idx == 1 ? {  } : {id: $route.query.id}
                            }"
                        >
                        {{ route?.name | translateTitle }}
                    </nuxt-link>
        
                    <span v-if="breadcrumbs.length >= 2 && idx == breadcrumbs.length - 1" class="font-small text-primary text-limit limit-1 breadcrumb-limit">
                        {{ route?.name | translateTitle }}
                    </span>
    
                    <i v-if="idx !== breadcrumbs?.length - 1 && breadcrumbs?.length <= 2" class="ri-arrow-right-s-line"></i>
                </div>
            </template>
        </template>

    </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import BackButton from '~/components/classrooms/micro/BackButton.vue';
import { TOP_HEADER_TITLE, BREADCRUMB_BY_ROUTE } from '~/commons/constants/title';
import { LIST_CUSTOM_ROUTE_INCLUDES, LIST_ROUTE_RELATIVE, LIST_CUSTOM_DATA_BREADCRUMBS, CUSTOM_BREADCRUMBS_ROUTE } from '~/commons/constants/breadcrumbs';

export default {
    props: {
        containerClass: String,
    },
    data() {
        return {
            userKind: localStorage.getItem('user_kind'),
            isLoaded: false,

            // Routes
            listRouteIncludes: [],
            listRouteRelative: [],
            isMobile: false,
            screenWidth: 0,
        }
    },
    components: { BackButton },
    filters: {
        translateTitle(title) {
            let tempTitle = title?.toLowerCase()
            let arrTitle = TOP_HEADER_TITLE;
            let format = /[:]/;

            const findTitle = arrTitle?.findIndex((title) => title?.key === tempTitle)

            if (findTitle === -1) return title?.toUpperCase()
            else return arrTitle?.[findTitle]?.value?.toUpperCase()
            
        },
    },
    mounted(){
        this.setScreenWidth();
        window.addEventListener("resize", this.setScreenWidth);
    },
    computed: {
        ...mapState({
            schoolsState: (state) => state.Schools
        }),
        breadcrumbs() {
            let routes = this.$route.matched?.[0]?.path?.split('/')
            let breadcrumbs = []
            let paramKeys = Object.keys(this.$route.params);
            let paramValues = Object.values(this.$route.params);

            routes.shift();

            routes?.map((route, index) => {
                let crumbs = {}
                let link = []
                let realPath = [];
                let format = /[:]/;
                
                if (!format.test(route)) {
                    routes?.map((item, idx) => {
                        if (index >= idx) {
                            link.push(item?.toLowerCase())
                            realPath.push(item);
                        }
                    })

                    if(routes[index+1] != undefined || routes[index+1] != null) {

                        if(!routes[index + 1].includes(':')) {
                            crumbs['route'] = `/${link.join('/')}`
                        } else {

                            crumbs['route'] = link.length > 2 ? `/${link.join('/')}/${paramValues[0]}` : `/${link.join('/')}` 

                        }
                    } else {
                        crumbs['route'] = `/${link.join('/')}`;
                    }
                    crumbs['name'] = route?.toUpperCase()
                    
                    let currentParam = null;
                    
                    if(routes[routes.length - 1].replace(":", "") == paramKeys[index]) {
                        currentParam = paramKeys[index];
                        if(!isNaN(this.$route.params[currentParam])) currentParam = Number(this.$route.params[currentParam]); 
                    }

                    let findParams = link.filter(item => item.includes(":") || item.includes("?")).map(item => item.replace(/[:?]/g, '').toLowerCase());

                    let paramValue = null;

                    for (let index = 0; index < findParams.length; index++) {
                        if(findParams[index] == paramKeys[index].toLowerCase()) {
                            paramValue = this.$route.params[paramKeys[index]];
                        }
                        else {
                            paramValue = null
                        }
                    }

                    let formattedLink = link.map(item => {
                        if (item.startsWith(':')) {
                            return paramValue;
                        } else {
                            return item;
                        }
                    }); 

                    for (let i = 0; i < formattedLink.length - 1; i++) {
                        if (!isNaN(parseInt(formattedLink[i]))) {
                            formattedLink.splice(i + 1, 1);
                            break;
                        }
                    }

                    breadcrumbs.push({
                        route: `/${formattedLink.join('/')}`,
                        name: crumbs.name,
                        path: `/${realPath.join('/')}`,
                    })

                } else {
                    routes?.map((item, idx) => {
                        if (index >= idx) {
                            link.push(item?.toLowerCase());
                            realPath.push(item);
                        }
                    })
                    
                    // let paramValue = this.$route.params[route.replace(/[:?]/g, '').toLowerCase() == paramKeys[0].toLowerCase() ? paramKeys[0] : null];

                    let findParams = link.filter(item => item.includes(":") || item.includes("?")).map(item => item.replace(/[:?]/g, '').toLowerCase());

                    let paramValue = null;
                    let paramKey = null;

                    for (let index = 0; index < findParams.length; index++) {
                        if(findParams[index] == paramKeys[index].toLowerCase()) {
                            paramValue = this.$route.params[paramKeys[index]];
                            paramKey = paramKeys[index];
                        }
                        else {
                            paramValue = null;
                            paramKey = null;
                        }
                    }
                    
                    if(isNaN(paramValue) && paramValue != undefined) {
                        let formattedLink = link.map(item => {
                            if (item.startsWith(':')) {
                                return paramValue;
                            } else {
                                return item;
                            }
                        }); 
                        crumbs['route'] = `/${formattedLink.join('/')}`
                        crumbs['name'] = paramValue.toUpperCase().replace(/-/g, " ");
                        crumbs['param'] = paramValue.toUpperCase();
                        crumbs['paramKey'] = paramKey;
                        crumbs['path'] = `/${realPath.join('/')}`;
    
                        breadcrumbs.push(crumbs);
                    } else {
                    }
                    
                }
            })

            for (let i = 0; i < breadcrumbs.length; i++) {

                if (breadcrumbs[i].param) {
                    const paramRoute = breadcrumbs[i].route; 
                    for (let j = i + 1; j < breadcrumbs.length; j++) {
                        breadcrumbs[j].route = breadcrumbs[j].route.replace(breadcrumbs[j].route, paramRoute);
                    }
                }
                
                // Custom Data Route Includes
                this.listRouteIncludes = [...LIST_CUSTOM_ROUTE_INCLUDES];

                for (let index = 0; index < this.listRouteIncludes.length; index++) {
                    let key = this.listRouteIncludes[index].key;
                    let newRoute = this.listRouteIncludes[index].newRoute;
                    if(breadcrumbs[i].route.includes(key)) {
                    let regexKey = new RegExp(key, "g");
                    breadcrumbs = breadcrumbs.map((route, index) => {
                        return {
                            ...route,
                            route: index === 1 ? route.route.replace(regexKey, newRoute) : route.route
                        }
                    });
                }
                }

                // Custom Data Route Relative
                this.listRouteRelative = [...LIST_ROUTE_RELATIVE];

                for (let index = 0; index < this.listRouteRelative.length; index++) {
                    let path = this.listRouteRelative[index].path;
                    let newPath = this.listRouteRelative[index].newPath;
                    if(breadcrumbs[i].route == path) {
                        breadcrumbs[i].route = newPath;
                    }
                }

                if(breadcrumbs[i].route == '/dashboard/classroom/requirements'){
                    breadcrumbs[i].route = '/dashboard/classroom/' + paramValues;
                } else if (breadcrumbs[i].route == '/dashboard/schools/students'){
                    breadcrumbs[i].name = this.schoolsState?.schoolName || "";
                }

                // Custom Data Breadcrumbs
                if(breadcrumbs[i].name.toLowerCase().includes('raport') && this.$route.path.includes('profile') && this.userKind == "student") {
                    breadcrumbs = [
                        {
                            "route": "/dashboard",
                            "name": "DASHBOARD"
                        },
                        {
                            "route": "/dashboard/achievement",
                            "name": "RAPORT"
                        },
                        {
                            "route": "/dashboard/achievement",
                            "name": this.$route.params.classSlug.replace(/-/g, " ")
                        },
                        {
                            "route": "/dashboard/achievement",
                            "name": "VIEW"
                        }
                    ]
                } else if (breadcrumbs[i].name.toLowerCase().includes('certificate') && this.$route.path.includes('profile') && this.userKind == "student") {
                    
                    breadcrumbs = [
                        {
                            "route": "/dashboard",
                            "name": "DASHBOARD"
                        },
                        {
                            "route": "/dashboard/achievement",
                            "name": "CERTIFICATE"
                        },
                        {
                            "route": "/dashboard/achievement",
                            "name": this.$route.params.classSlug.replace(/-/g, " ")
                        },
                        {
                            "route": "/dashboard/achievement",
                            "name": "VIEW"
                        }
                    ]
                }

            }

            // const width = (window.innerWidth > 0) ? window.innerWidth : screen.width
            // if (width < 540) {
            //     if (breadcrumbs.length > 2) {
            //         breadcrumbs = [breadcrumbs[breadcrumbs.length - 1]]
            //     }
            // }

            // CUSTOM TITLE OF BREADCRUMB
            const currentRoute = this.$route?.name;
            let titleOfCrumbs = [];
            BREADCRUMB_BY_ROUTE.forEach((item) => {
                if(currentRoute == item?.route){
                    item?.params?.map((param) => {
                        let titleOfStore = {};
                        let variableOfStore = item?.variableOfStore?.[param];
                        titleOfStore.title = this.$store?.state?.[variableOfStore[0]]?.[variableOfStore[1]]?.[variableOfStore[2]];
                        titleOfStore.nameOfParam = param;
                        titleOfStore.valueOfParam = this.$route?.params?.[param];
                        titleOfCrumbs.push(titleOfStore);
                    })
                }
            })

            titleOfCrumbs.forEach(item => {
                breadcrumbs.forEach(breadcrumb => {
                    if(breadcrumb?.paramKey == item?.nameOfParam){
                        breadcrumb.name = item?.title?.toUpperCase();
                    }
                })
            });
            // END LOGIC FROM CUSTOM TITLE OF BREADCRUMB

            /**
             * CUSTOM ROUTE AT BREADCRUMB
             * if there is any path that want to changed, you can define the path in file /commons/constants/breadcrumbs.js
             */
            CUSTOM_BREADCRUMBS_ROUTE.forEach(route => {
                route?.paths?.forEach(path => {
                    breadcrumbs.forEach(breadcrumb => {
                        if(path === breadcrumb?.path){
                            if(route?.isParamExist) breadcrumb.route = this.changePathParam(route?.newPath, route?.params);
                            else breadcrumb.route = route?.newPath?.toLowerCase();
                        }
                    })
                })
            })

            this.$store?.dispatch("Layouts/setBreadcrumbs", breadcrumbs);

            return breadcrumbs
        },
        showBackButton() {
            const routerLength = this.$route?.fullPath?.split("/")?.length
            
            if (routerLength > 3) return true
            else return false
        },
        ...mapState({
            listTab: state => state.Layouts?.tabs,
        })

    },
    methods: {
        ...mapActions({
            setTabs: 'Layouts/getTabs',
        }),
        
        setRoute() {
            this.$routes = this.$route;
        },
        changePathParam(route, params){
            const currentRoute = route?.split("/");
            currentRoute.shift();
            currentRoute?.map((eachRoute, index) => {
                if(eachRoute.startsWith(":")){
                    let paramValue = "";
                    params?.map(param => {
                        if(eachRoute?.includes(param)){
                            paramValue = this.$route?.params?.[param];
                        }
                    })
                    currentRoute[index] = paramValue;
                }
            })
            return `/${currentRoute.join("/").toLowerCase()}`;
        },
        setScreenWidth(){
            this.screenWidth = window.innerWidth;
            if(this.screenWidth < 768) this.isMobile = true;
            else this.isMobile = false;
        }
    },
}
</script>

<style scoped>
.font-small {
    font-size: 12px;
    font-weight: 500;
}

a:hover {
    color: var(--bs-primary);
}

.breadcrumb-limit{
    max-width: 400px;
}
</style>