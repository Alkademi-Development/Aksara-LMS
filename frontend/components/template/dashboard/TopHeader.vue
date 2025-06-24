<template>
    <div :class="`d-flex align-items-center bg-white ${!filter ? 'border-bottom' : ''} px-4 pt-4 position-sticky sticky-top`">
        <div class="w-100">
            <b-row no-gutters>
                <b-col cols="12" :class="['d-flex justify-content-between align-items-center', (showActionButton && action?.position === 'head') && 'mb-2']">
                    <Breadcrumb
                        v-if="!!breadcrumb"
                        containerClass="mb-2"
                    />

                    <div class="action__buttons">
                        <div
                            v-if="showChatDrawer"
                            id="button-chats-header"
                            class="border rounded toggle-chats pointer"
                            @click="toggleChats"
                        >
                            <i class="ri-chat-3-line variant"></i>
                        </div>

                        <div v-if="role == 'admin' || role == 'superadmin'" class="dropdown menu-mobile">
                            <a class="hamburger-menu rounded d-sm-none" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="ri-menu-fill"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-left d-sm-none">
                                <div class="row shortcuts p-0 m-0">
                                    <template v-for="(nav, index) in computedSidebar">
                                        <template v-if="nav._name !== 'SidebarNavDropdown'">
                                            <MobileMenu
                                                :key="index"
                                                :type="nav._name"
                                                :name="nav.name"
                                                :icon="nav.icon"
                                                :color="nav.color"
                                                :to="nav.to"
                                            />
                                        </template>
                                        <template v-else>
                                            <MobileMenu
                                                v-for="(item, idx) in nav?.sub"
                                                :key="`sub-${item.name.toLowerCase()}-${idx}`"
                                                :type="item._name"
                                                :name="item.name"
                                                :icon="item.icon"
                                                :color="item.color"
                                                :to="item.to"
                                            />
                                        </template>
                                    </template>
                                    <MobileMenu
                                        type="SidebarNavItem"
                                        name="Profil"
                                        icon="ri-user-3-line"
                                        color="gray"
                                        to="/dashboard/profile"
                                    />
                                    <MobileMenu
                                        type="SidebarNavItem"
                                        name="Logout"
                                        icon="ni-user-run"
                                        color="gray"
                                        :isLogout="true"
                                        @isModalLogout="isModalLogout = true"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="hamburger-menu border rounded d-none d-sm-block d-xl-none" @click="onClickMenu">
                            <i class="ri-menu-fill"></i>
                        </div>

                        <div class="hamburger-menu border rounded d-sm-none" @click="onClickMenu" v-if="role == 'writer'">
                            <i class="ri-menu-fill"></i>
                        </div>

                        <div class="hamburger-menu d-sm-none" v-if="role != 'admin' && role != 'superadmin' && role != 'writer'">
                            <ProfileMenu />
                        </div>
                    </div>
                </b-col>

                <b-col cols="12" :class="`d-flex justify-content-between align-items-center gap-3 flex-wrap flex-sm-nowrap ${ !!tabs ? 'mb-0' : 'mb-3' }`">
                    <h2 :class="`font-semibold text-limit limit-1 ${paramClassroom ? '' : 'text-capitalize'}`" v-if="!!title && !filter && !title.includes(notIncludeTitle)">
                        {{ topHeaderTitle ? topHeaderTitle : title | translateTitle }}
                    </h2>

                    <div class="d-flex align-items-center" style="gap: 10px;">
                        <div class="box-progress d-flex gap-3">
                            <p v-for="(item, index) in activeBadges" :key="index" :class="`badge-progress ${item?.style}`">{{ item?.label }}</p>
                        </div>


                        <template v-if="(showActionButton && action?.position === 'head') || showActionButtonCourse">
                            <div class="d-flex justify-content-end gap-3" v-if="action?.type === 'multiple'">
                                <template v-if="action?.from == 'detailModuleClassroom' || action?.from === 'detailModuleCourses'">
                                    <template v-if="role !== 'student'">
                                        <template v-if="action?.from == 'detailModuleClassroom'">
                                            <div v-for="(action, idx) in action?.items" :key="idx">
                                                <ButtonActionHeader
                                                    v-if="!classroomsState?.detailModule?.editable && action?.action == 'delete'"
                                                    :action="action"
                                                    :stateAction="stateAction"
                                                    :userKind="userKind"
                                                    @editMateri="editMateri"
                                                    @deleteMateri="deleteMateri"
                                                    @publishMateri="publishMateri"
                                                />
                                                <ButtonActionHeader
                                                    v-if="isShowButtonEditInClass(action?.action) || isShowButtonPublishInClass(action?.action)"
                                                    :action="action"
                                                    :stateAction="stateAction"
                                                    :userKind="userKind"
                                                    @editMateri="editMateri"
                                                    @deleteMateri="deleteMateri"
                                                    @publishMateri="publishMateri"
                                                />
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div v-for="(action, idx) in action?.items" :key="idx">
                                                <ButtonActionHeader
                                                    v-if="isShowActionEditAndDeleteCourse(action?.action) || isShowActionPublishCourse(action?.action)"
                                                    :action="action"
                                                    :stateAction="stateAction"
                                                    :userKind="userKind"
                                                    @editMateri="editMateri"
                                                    @deleteMateri="deleteMateri"
                                                    @publishMateri="publishMateri"
                                                />
                                            </div>
                                        </template>
                                    </template>
                                </template>
                                <template v-else>
                                    <div v-for="(action, idx) in action?.items" :key="idx">
                                        <ButtonActionHeader
                                            :action="action"
                                            :stateAction="stateAction"
                                            :userKind="userKind"
                                            @editMateri="editMateri"
                                            @deleteMateri="deleteMateri"
                                        />
                                    </div>
                                </template>
                            </div>
                            <template v-else>
                                <ButtonActionHeader
                                    v-if="action?.from === 'detailBundle' && role === 'superadmin'"
                                    :action="action"
                                    :stateAction="stateAction"
                                    :userKind="userKind"
                                    @goToForm="goToForm"
                                    @goToEditAttendance="goToEditAttendance"
                                    @showModalPublishModule="openModalPublishModule"
                                    @editBundle="editBundle"
                                    @editMateri="editMateri"
                                />
                                <ButtonActionHeader
                                    v-else-if="action?.from !== 'detailBundle'"
                                    :action="action"
                                    :stateAction="stateAction"
                                    :userKind="userKind"
                                    @goToForm="goToForm"
                                    @goToEditAttendance="goToEditAttendance"
                                    @showModalPublishModule="openModalPublishModule"
                                    @editBundle="editBundle"
                                    @editMateri="editMateri"
                                />
                            </template>
                        </template>

                        <div
                            v-if="showActionButton && action?.position === 'body'"
                            class="d-sm-none"
                        >
                            <ButtonActionHeader
                                :action="action"
                                :stateAction="stateAction"
                                :userKind="userKind"
                            />
                        </div>
                    </div>
                </b-col>

                <b-col cols="12" class="d-flex justify-content-between align-items-center">
                    <Tabs
                        v-if="!!tabs"
                        :tabs="tabsItems"
                        :activeTab="activeTabs"
                        :userKind="userKind"
                        @setActiveTab="setActiveTab"
                        :isTestCase="classroomDetail?.type === 'test'"
                        class="w-100"
                    />

                    <Filters
                        v-if="!!filter"
                        id="top-header-filter"
                        class="style-2 w-100 mt-2 mb-3 w-100"
                        variant="outline-primary"
                        toggleClass="w-100 text-limit limit-1"
                        menuClass="w-100"
                        :text="selectedFilter?.label"
                        :items="classroomOptions"
                        :selectedItem="selectedFilter"
                        :isLoaded="isLoadedClass"
                        :isLoadMoreClass="isLoadMoreClass"
                        :pagination="pagination"
                        @onChange="setSelectedFilters"
                        @onChangePage="handlePaginationClass"
                    />

                    <div class="d-none d-sm-block">
                        <ButtonActionHeader
                            v-if="showActionButton && action?.position === 'body'"
                            :action="action"
                            :stateAction="stateAction"
                            :userKind="userKind"
                        />
                    </div>
                </b-col>
            </b-row>
        </div>

        <b-modal id="modalConfirmationLogout" v-model="isModalLogout" size="sm" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                :title="`Peringatan!`"
                :description="`Apakah anda yakin akan melakukan <strong class='text-danger'>Logout</strong> sekarang?`"
                :btnYesVariant="`danger`"
                :btnNoVariant="`outline-primary`"
                :btnNoTitle="`Tidak`"
                @actionYes="logout"
                @actionNo="isModalLogout = false"
            />
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import { TOP_HEADER_TITLE, TOP_HEADER_TITLE_BY_ROUTE } from '~/commons/constants/title';
import { DATA_FILTERS } from '@/commons/constants/layouts.js'
import Breadcrumb from '../micro/header/Breadcrumb.vue';
import Tabs from '../micro/header/Tabs.vue';
import Filters from '../micro/buttons/ButtonDropdownFilter.vue'
import ButtonActionHeader from '../micro/buttons/ButtonActionHeader.vue';
import MobileMenu from "@/components/template/micro/menu/MobileMenu.vue"
import ProfileMenu from "../micro/menu/ProfileMenu.vue";
import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue"

import sidebar from "@/static/dashboard/assets/js/components/template/_nav"
import appToken from '~/api/app-token';

export default {
    components: {
        Breadcrumb,
        Tabs,
        Filters,
        ButtonActionHeader,
        ProfileMenu,
        MobileMenu,
        ModalConfirmation,
    },
    props:{
        breadcrumb: Boolean,
        title: String,
        tabs: Boolean,
        filter: Boolean,
        action: {
            type: Object,
            required: false,
            default: () => {}
        },
        isMobile: Boolean,
        role: String,
        showChatDrawer: Boolean
    },
    data() {
        return {
            isModalLogout: false,
            paramClassroom : this.$route?.params?.classroom,

            // Data without top header title
            notIncludeTitle: [
                'assignment'
            ],
            user: JSON.parse(localStorage.getItem("user")),

            // Classrooms
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
            isLoadedClass: false,
            classrooms: null,
            classroomOptions: [],
            isLoadMoreClass: false,
        }
    },
    filters: {
        translateTitle(title) {
            let tempTitle = title?.toLowerCase()
            let arrTitle = TOP_HEADER_TITLE;

            const findTitle = arrTitle?.findIndex((title) => title?.key === tempTitle)

            if (findTitle === -1) return title?.replace(/-/g, " ")
            else return arrTitle?.[findTitle]?.value?.replace(/-/g, " ")
        }
    },
    watch: {
        "$route.name":{
            handler(routeName){
                this.pagination.page = 1;
                this.classroomOptions = [];

                if(DATA_FILTERS.includes(routeName)){
                    this.fetchListClassrooms();
                }
            },
            deep: true,
        }
    },
    computed: {
        ...mapState({
            tabsItems: (state) => state.Layouts?.tabs,
            activeTabs: (state) => state.Layouts?.activeTab,
            stateSidebar: (state) => state.Layouts?.stateSidebar,
            filterItems: (state) => state.Layouts?.filters,
            activeBadges: (state) => state.Layouts?.activeBadges,
            selectedFilter: (state) => state.Layouts?.stateFilter,
            stateAction: (state) => state.Layouts?.stateAction,
            userKind: (state) => state.Auth?.user_kind,
            sassState: (state) => state.Sass,
            classroomDetail: (state) => state?.Services?.classroomDetail,
            servicesState: (state) => state.Services,
            classroomsState: (state) => state?.Classrooms,
            moduleDetailState: (state) => state?.Services?.moduleDetail,
        }),
        isFetchError(){
            let route = this.$route?.path;
            route = route.split("/");
            const isFromClass = route.includes("classrooms");
            return isFromClass ? !this.classroomsState?.status : !this.servicesState?.status;
        },
        showActionButton() {
            return(
                !!this.action &&
                this.userKind === 'superadmin' ||
                this.userKind === 'admin' ||
                this.userKind === 'lead_region' ||
                this.userKind === 'writer'
            )
        },
        showActionButtonCourse(){
            return this.userKind === 'mentor' && this.action?.from == "detailModuleClassroom"
        },
        computedSidebar() {
            const listSidebar = sidebar[0]._children
            const settings = this.sassState.settings

            if (!settings.listMenu) settings.listMenu = ["dashboard", "schedules"]

            return listSidebar.filter(item => {

                const menuItem = settings.listMenu.find((menu) => menu == item.slug)

                if (menuItem) {
                    return item.roles.includes(this.role) || item.roles.includes("all")
                } else if (item._name == 'divider') {
                    let showDivider = false

                    item.slug.map((divider) => {
                        if (settings.listMenu.includes(divider)) showDivider = true
                    })

                    if (showDivider) return item.roles.includes(this.role) || item.roles.includes("all")
                }
            })
        },
        topHeaderTitle() {
            let routes = this.$route.matched?.[0]?.path?.split('/');
            let title = "";
            let paramKeys = Object.keys(this.$route.params);
            let paramValues = Object.values(this.$route.params);

            this.paramClassroom = this.$route.params.classroom;
            routes.shift();

            routes?.map((route, index) => {
                let link = []
                let format = /[:]/;

                if (!format.test(route)) {
                    routes?.map((item, idx) => {
                        if (index >= idx) {
                            link.push(item?.toLowerCase())
                        }
                    })

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

                } else {
                    routes?.map((item, idx) => {
                        if (index >= idx) {
                            link.push(item?.toLowerCase())
                        }
                    })

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

                    if(isNaN(paramValue) && paramValue != undefined) {
                        let formattedLink = link.map(item => {
                            if (item.startsWith(':')) {
                                return paramValue;
                            } else {
                                return item;
                            }
                        });

                        title = this.$route.params.classroom || routes.includes("Classroom") ? this.classroomDetail?.name : formattedLink[formattedLink.length - 1];

                    } else {
                    }

                }
            })

            // Custom Title By Route
            let found = TOP_HEADER_TITLE_BY_ROUTE.find(item => item.route === this.$route.name);
            if(found){
                if(found?.dynamic) title = this.$store.state?.[found?.variableOfStore[0]]?.[found?.variableOfStore[1]]?.title || found?.title;
                else title = found?.title;
            }
            return title;

        },
        isAuthorSame(){
            const moduleAuthor = this.moduleDetailState?.author || this.moduleDetailState?.Author;
            // return false;
            return moduleAuthor?.id == this.user?.id;
        },
    },
    mounted(){
        if(this.filter) this.fetchListClassrooms();
    },
    methods: {
        ...mapActions({
            getTabs: 'Layouts/getTabs',
            setActiveTab: 'Layouts/setActiveTab',
            setStateSidebar: 'Layouts/setStateSidebar',
            setSelectedFilter: 'Layouts/setSelectedFilter'
        }),
        setSelectedFilters(filter) {
            this.$router?.replace({query: {}}).catch(err => {});
            filter = Object.keys(this.$route.query).length > 0 ? {
                label: this.$route.query.classroomName,
                slug: this.$route.query.classroomSlug,
                value: parseInt(this.$route.query.classroomId),
            } : filter;
            this.setSelectedFilter(filter)
        },
        onClickMenu(){
            this.$emit('onPinSidenav')
        },
        goToForm() {
            setTimeout(() => {
                window.open(this.stateAction, "_blank");
            }, 250);
        },
        async logout() {
            const redirectTo = "?redirectTo=" + (this.layoutActive == `pesilat` ? `https://alkademi.id/pesilat` : window?.location?.origin)
            const alkademiAuth = process?.env?.alkademiAuth + "/logout"
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const appId = "&appId=" + appToken.getAppId();
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

            const url = alkademiAuth + redirectTo + appId + lmsId + codeToken + generatedToken

            localStorage.clear()
            window.location?.replace(url)
        },
        toggleChats() {
            this.$emit('toggleChats')
        },
        goToEditAttendance() {
            setTimeout(() => {
                const path = this.$route?.fullPath

                this.$router.push(path.replace('recap', 'edit'))
            }, 100)
        },
        openModalPublishModule(){
            this.$store.commit("Courses/SET_ISPUBLISHMODULEDRAFT", true);
        },
        editBundle(){
            const bundleDetail = this.$store.state?.Courses?.bundle;
            this.$router.push(`/dashboard/courses/bundle/edit/${bundleDetail?.slug}`)
        },
        editMateri(){
            const routes = this.$route.path.split("/");
            if(routes.includes("classroom")){
                const courseSlug = this.$route?.params?.course;
                const classroomSlug = this.$route?.params?.classroom;
                this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${courseSlug}/edit`);
            } else {
                const courseDetail = this.$store.state?.Services?.moduleDetail;
                if(this.activeTabs === 'library') this.$router.push(`/dashboard/courses/materi/edit/${courseDetail?.slug}`);
                else if (this.activeTabs === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/materi/edit/${courseDetail?.slug}`);
                else if (this.activeTabs === 'draft') this.$router.push(`/dashboard/courses/draft/materi/edit/${courseDetail?.slug}`);
            }
        },
        deleteMateri(){
            this.$store.commit("Courses/SET_ISDELETECOURSE", true);
        },
        isShowActionPublishCourse(actionType){
            const userAccessButton = ["superadmin", "admin"];
            return userAccessButton.includes(this.role) && actionType === 'publish' && this.moduleDetailState?.state === 'draft';
        },
        isShowActionEditAndDeleteCourse(actionType){
            const userAccessButton = ["superadmin", "admin"];
            const buttonActionAccess = ["edit", "delete"]
            return (userAccessButton.includes(this.role) || this.isAuthorSame) && buttonActionAccess.includes(actionType);
        },
        publishMateri(){
            this.$store.dispatch("Courses/setIsPublishMateriDraft", true);
        },
        async fetchListClassrooms(){
            if(!this.isLoadMoreClass) this.isLoadedClass = false;

            const params = {
                page: this.pagination?.page,
                perPage: this.pagination?.perPage,
            }

            await this.$store?.dispatch("Services/classrooms", params);

            if(!this.servicesState?.status){
                console.error("Failed to fetch list classrooms : " + this.servicesState?.message);
                this.isLoadedClass = true;
            }else{
                this.classrooms = this.servicesState?.classrooms;

                const paginationClass = this.servicesState?.pagination;

                this.pagination.page = paginationClass?.page;
                this.pagination.perPage = paginationClass?.perPage;
                this.pagination.totalItems = paginationClass?.totalItems;
                this.pagination.totalPages = paginationClass?.totalPages;

                if(this.classrooms?.length > 0){
                    this.classrooms.map((item) => {
                        const object = {
                            label: item?.name,
                            slug: item?.slug,
                            value: item?.id
                        }
                        this.classroomOptions.push(object)
                    })
                }else{
                    if(!this.isLoadMoreClass) this.classroomOptions.push({label:"Belum ada kelas!",value:-1})
                }

                this.isLoadedClass = true;
                this.isLoadMoreClass = false;
            }
        },
        handlePaginationClass(){
            this.pagination.page += 1;
            this.isLoadMoreClass = true;
            this.fetchListClassrooms();
        },
        isShowButtonPublishInClass(actionType){
            return actionType == 'publish' && this.classroomsState?.detailModule?.state == 'draft' && this.classroomsState?.detailModule?.editable;
        },
        isShowButtonEditInClass(actionType){
            return actionType != 'publish' && this.classroomsState?.detailModule?.editable;
        }
    },
}
</script>

<style lang="scss" scoped>

.action__buttons {
    display: flex;
    align-items: center;
    gap: 8px;
}

.hamburger-menu {
    cursor: pointer;
    line-height: 16px;
    padding: 6px;
    font-size: 18px;
    width: fit-content;
}

.font-semibold {
    font-weight: 600;
}

@media (min-width: 320px) {
    .dropdown.menu-mobile .dropdown-menu {
        position: fixed !important;
        right: auto;
        left: 3%;
        width: 94%;
        height: 76vh;
        overflow: overlay;
        min-width: auto;
        transform: translate3d(3%, 4rem, 0px) !important;
    }
}
</style>
<style lang="scss">
</style>
