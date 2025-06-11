<template>
  <div>
    <div :class="`sidebar-timeline pr-0 ${role === 'student' ? 'type-student' : ''} ${isShowButtonTopHeader ? 'expand-top' : 'not-expand-top'} ${isSidebarClosed ? 'closed' : 'open'}`" ref="sidebarTimeline">
      <div class="h-100 d-flex flex-column position-relative bg-white border-right">
        <div class="btn-expand d-flex d-md-none" @click="isSidebarClosed = !isSidebarClosed">
          <i :class="isSidebarClosed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'"></i>
        </div>

        <div v-if="role === 'student'" class="p-4 border-bottom" style="flex: 0 0 auto;">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5>Proses Belajar</h5>
            <p class="mb-0">{{ moduleCounter?.totalCompletion }}/{{ moduleCounter?.totalTopics }}</p>
          </div>
          <b-progress :value="moduleCounter?.progress" :max="100" class="mb-0" variant="primary"></b-progress>
        </div>

        <!-- Section Navigate to Statistic -->
        <div v-else-if="role !== 'student' && isFromClass" class="border-bottom" style="flex: 0 0 auto; padding: 20px 24px;">
          <div v-if="showContent !== 'statistic'" class="d-flex justify-content-between align-items-center cursor-pointer" @click="onClickStatistic">
            <h5 class="text-primary">Lihat Statistik Belajar</h5>
            <i class="ri-arrow-right-s-line text-primary" style="font-size: 18px"></i>
          </div>
          <div v-else class="d-flex align-items-center cursor-pointer gap-3" @click="onClickBackTopic">
            <i class="ri-arrow-left-s-line text-primary" style="font-size: 18px"></i>
            <h5 class="text-primary">Detail Modul</h5>
          </div>
        </div>

        <!-- List Modules -->
        <div class="container-list-item d-flex flex-column gap-3 overflow-hidden p-4" style="flex: 1;">
          <div class="wrapper-list-item d-flex flex-column gap-4" style="flex: 1;">
            <template v-if="showContent !== 'statistic'">
              <template v-if="isLoaded">
                <div :class="`d-flex align-items-center justify-content-between list-item cursor-pointer gap-4 ${statusListTopics?.currentTopic?.typeOfList == 'overview' && statusListTopics?.currentTopic?.active ? 'active' : ''}`" @click="onClickOverview">
                  <div class="d-flex align-items-center gap-3">
                    <i class="ri-sticky-note-line"></i>
                    <p class="mb-0 font-weight-bold">Overview</p>
                  </div>
                </div>
                <div v-for="(item, idx) in listItem" :key="idx" :class="`d-flex align-items-center justify-content-between list-item cursor-pointer gap-4 ${item?.locked ? 'locked' : statusListTopics?.currentTopic?.data?.id === item?.id ? 'active' : ''}`">
                  <div class="d-flex align-items-center gap-3 w-100" @click="onClickList(item)">
                    <i v-if="item?.kind === 'course'" class="ri-file-list-line"></i>
                    <i v-else-if="item?.kind === 'assignment'" class="ri-checkbox-multiple-line"></i>
                    <p class="mb-0 font-weight-bold text-limit limit-1">{{ item?.title }}</p>
                  </div>
                  <template v-if="role == 'student' || checkingLockState">
                    <p v-if="checkingTimerInTopicLock(item)" class="mb-0 font-weight-bold">{{ timerTopic }}</p>
                    <i v-else-if="checkingTimerOverInTopicLock(item)" class="ri-lock-unlock-line"></i>
                    <i v-else-if="item?.locked" class="ri-lock-line"></i>
                    <i v-else-if="checkingSuccessTopic(item) || checkingSucessAssignment(item)" class="ri-checkbox-circle-line text-success"></i>
                  </template>
                  <div v-if="item?.state === 'draft' || checkingActionModule(item)" class="d-flex align-items-center gap-2">
                    <div v-if="item?.state === 'draft'" class="bg-gray px-2 rounded py-1">
                      <p class="mb-0 text-white" style="font-size: 12px; font-weight: 600;">Draft</p>
                    </div>
                    <div v-if="checkingActionModule(item)" class="d-flex align-items-center gap-2 wrapper-btn-action" style="flex-shrink: 0">
                      <i class="ri-pencil-line cursor-pointer text-darker" @click="onClickEdit(item)"></i>
                      <i class="ri-delete-bin-7-line text-danger cursor-pointer" @click="onClickDelete(item)"></i>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="d-flex flex-column gap-4">
                <b-skeleton v-for="idx in 10" :key="idx" animation="wave" width="100%" height="20px"></b-skeleton>
              </div>
            </template>
            <template v-else>
                <template v-if="!isLoadingListStatistic && isLoaded">
                  <div v-for="(statistic, index) in statistics" :key="index" class="border p-3 rounded card-statistic">
                    <p class="mb-0 title-statistic">{{ statistic?.title }}</p>
                    <p class="mb-0 counter-statistic text-primary">{{ statistic?.counter }}</p>
                  </div>
                </template>
                <template v-else>
                  <div v-for="index in 4" :key="`skeleton-${index}`" class="border p-3 rounded card-statistic">
                    <b-skeleton animation="wave" width="70%" class="mb-4"></b-skeleton>
                    <b-skeleton animation="wave" width="30%"></b-skeleton>
                  </div>
                </template>
              </template>
          </div>
        </div>
        <template v-if="isLoaded">
          <template v-if="showContent !== 'statistic'">
            <div v-if="(role !== 'student' && role !== 'teacher' && isShowButtonCreateModule && !isFetchError) || isAuthorSame" class="w-100 px-4 pb-4" style="flex: 0 0 auto">
              <b-button variant="primary" class="d-flex align-items-center gap-3 w-100 justify-content-center" style="font-size: 14px;" @click="onClickCreateModule">Tambah Module <i class="ri-add-fill"></i></b-button>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div v-show="!isSidebarClosed" class="sidebar-backdrop d-md-none" @click="isSidebarClosed = !isSidebarClosed"></div>
  </div>
</template>

<script>
import { toDecrypt, toEncrypt } from '~/commons/utils';
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    isLoaded: {
      type: Boolean,
      default: false,
    },
    listItem: {
      type: Array,
      default: [],
    },
    moduleCounter: {
      type: Object,
      default() {
        return {
          id: null,
          progress: 0,
          totalCompletion: 0,
          totalTopics: 0,
        }
      }
    },
    statusListTopics: {
      type: Object,
      default: null,
    },
    showContent: {
      type: String,
      default: ""
    },
    isFromClass: {
      type: Boolean,
      default: false,
    },
    isShowButtonCreateModule: {
      type: Boolean,
      defualt: false,
    },
    timerTopic: {
      type: Number,
    },
    isStopTimerTopic: {
      type: Boolean,
      default: false,
    },
    detailModule: {
      type: Object,
      default: () => {},
    },
    classroomDetail: {
      type: Object,
      default: () => {},
    },
    isFetchStatistic: {
      type: Boolean,
      default: false,
    },
    topicLocked: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
        getActiveTab: (state) => state?.Layouts?.activeTab,
        servicesState: state => state.Services,
        detailModuleState: (state) => state?.Services?.moduleDetail,
        classroomsState: (state) => state?.Classrooms,
        totalCompletionState: (state) => state?.Classrooms?.moduleCounter?.totalCompletion,
        totalTopicsState: (state) => state?.Classrooms?.moduleCounter?.totalTopics,
        statisticsState: (state) => state?.Statistics,
    }),
    isFetchError(){
      return this.isFromClass ? !this.classroomsState?.status : !this.servicesState?.status;
    },
    isShowButtonTopHeader(){
      return (this.getActiveTab === 'library' && this.role === 'superadmin') || (this.isFromClass && this.role != 'student');
    },
    checkingLockState(){
      return this.role !== 'superadmin' && !this.detailModuleState?.owned && !this.isFromClass;
    },
    isAuthorSame(){
      const authorOfModule = this.detailModuleState?.author || this.detailModuleState?.Author;
      return this.role !== 'superadmin' && this.role !== 'student' && authorOfModule?.id === this.user?.id;
    },
    lastTopicUnlock(){
      const reverseListTopic = [...this.listItem];
      reverseListTopic.reverse();
      const foundTopicUnlock = reverseListTopic?.find(item => !item?.locked && item?.kind === 'course');
      return foundTopicUnlock;


      // const indexTopicLock = this.listItem?.findIndex(item => item?.locked && item?.kind === "course");
      // return indexTopicLock > 0 ? this.listItem[indexTopicLock - 1] : indexTopicLock == -1 ? this.listItem[this.listItem?.length - 1] : null;
    },
    firstTopicLock(){
      return this.listItem?.find(item => item?.locked);
    },
    lastTopic(){
      return this.listItem[this.listItem?.length - 1];
    },
  },
  watch: {
    isFetchStatistic(state){
      if(state && this.showContent == "statistic") this.fetchListStatistic();
    },
  },
  data(){
    return {
      role: "",
      statistics: [
        { title: "Total Siswa", key:"totalStudent", counter: 0 },
        { title: "Progress 0-24%", key:"0", counter: 0 },
        { title: "Progress 25-49%", key:"25", counter: 0 },
        { title: "Progress 50-74%", key:"50", counter: 0 },
        { title: "Progress 75-99%", key:"75", counter: 0 },
        { title: "Progress 100%", key:"100", counter: 0 },
      ],
      user: JSON.parse(localStorage.getItem("user")),
      isSidebarClosed: true,
      windowWidth: window.innerWidth,
      isLoadingListStatistic: false,

      // Statistic
      listStatisticModule: null,
    }
  },
  created(){
    this.role = localStorage.getItem("user_kind");
  },
  mounted(){
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions({
        fetchListStatisticModule: 'Statistics/fetchListStatisticModule',
    }),
    onClickList(item){
      if(item?.slug){
        this.$store.commit("Courses/SET_IS_MOVE_MODULE", true);
        if(this.isFromClass){
          if(item?.locked && this.role === 'student'){
            this.$emit("topicLockedAction")
          }else{
            const classroomSlug = this.$route?.params?.classroom;
            const moduleSlug = this.$route?.params?.course;

            if(item?.kind == 'course') this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/module/${item?.slug}`);
            else if(item?.kind == "assignment") this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/assignment/${item?.slug}`);
          }
        }else{
          if(item?.locked){
            this.$emit("topicLockedAction");
          }else{
            const courseSlug = this.$route.params?.courseId;
            if(this.getActiveTab === 'library') this.$router.push(`/dashboard/courses/modules/${courseSlug}/topic/${item?.slug}`);
            else if(this.getActiveTab === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/modules/${courseSlug}/topic/${item?.slug}`);
            else if(this.getActiveTab === 'draft') this.$router.push(`/dashboard/courses/draft/modules/${courseSlug}/topic/${item?.slug}`);
          }
        }
      }
    },
    onClickOverview(){
      this.$store.commit("Courses/SET_IS_MOVE_MODULE", true);
      if(this.isFromClass){
        const classroomSlug = this.$route?.params?.classroom;
        const moduleSlug = this.$route?.params?.course;
        localStorage.removeItem("topic");
        this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}`);
      }else{
        const courseSlug = this.$route.params?.courseId;
        if(this.getActiveTab === 'library') this.$router.push(`/dashboard/courses/modules/${courseSlug}`);
        else if(this.getActiveTab === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/modules/${courseSlug}`);
        else if(this.getActiveTab === 'draft') this.$router.push(`/dashboard/courses/draft/modules/${courseSlug}`);
      }
    },
    onClickStatistic(){
      this.$store.commit("Courses/SET_IS_MOVE_MODULE", false);
      if(this.isFromClass){
        const classroomSlug = this.$route?.params?.classroom;
        const moduleSlug = this.$route?.params?.course;
        this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/statistic`);
      }
    },
    onClickBackTopic(){
      this.$store.commit("Courses/SET_IS_MOVE_MODULE", false);
      if(this.isFromClass){
        const classroomSlug = this.$route?.params?.classroom;
        const moduleSlug = this.$route?.params?.course;
        this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}`);
      }
    },
    onClickCreateModule(){
      this.$emit("onClickCreateModule");
    },
    onClickDelete(item){
      this.$emit("onClickDelete", item);
    },
    onClickEdit(item){
      this.$emit("onClickEdit", item);
    },
    checkingActionModule(module){
      return ((this.role !== 'student' && module?.editable) || this.role === 'superadmin');
      // return ((this.role !== 'student' && module?.editable) || this.role === 'superadmin') || this.isAuthorSame;
    },
    handleResize(){
      this.windowWidth = window.innerWidth;
      if(this.windowWidth > 768){
        this.isSidebarClosed = true;
      }
    },
    checkingSuccessTopic(topic){
      return this.role === 'student' && topic?.kind === 'course' && topic?.readed;
      // return this.role === 'student' && !topic?.locked && topic?.kind === 'course' && (this.lastTopicUnlock?.id !== topic?.id || (this.totalCompletionState == this.totalTopicsState && this.lastTopicUnlock?.id == topic?.id));
    },
    checkingSucessAssignment(topic){
      return this.role === 'student' && topic?.kind === 'assignment' && topic?.passed;
    },
    checkingTimerInLastTopic(topic){
      return this.role === 'student' && !topic?.locked && this.lastTopic?.id === topic?.id && !this.isStopTimerTopic;
    },
    checkingTimerInTopicLock(topic){
      return (this.role === 'student' && topic?.locked && this.firstTopicLock?.id == topic?.id && this.firstTopicLock?.kind === 'course' && !this.isStopTimerTopic) && (this.topicLocked?.data?.id == topic?.id) && this.topicLocked?.showTimerIn === 'sidebar';
    },
    checkingTimerOverInTopicLock(topic){
      return this.role === 'student' && topic?.locked && this.firstTopicLock?.id == topic?.id && this.firstTopicLock?.kind === 'course' && this.isStopTimerTopic && this.timerTopic == 0;
    },
    async fetchListStatistic(){
      this.isLoadingListStatistic = true;

      const params = {
        moduleId: this.detailModule?.id,
        classroomId: this.classroomDetail?.id,
      }

      await this.fetchListStatisticModule(params);

      if(!this.statisticsState?.status){
        console.error(`Failed to fetch : ${this.statisticsState?.message}`);
        this.listStatisticModule = null;
        this.isLoadingListStatistic = false;
      }else{
        this.listStatisticModule = this.statisticsState?.listStatisticModule[0];
        this.statistics.map((statistic) => {
          statistic.counter = this.listStatisticModule?.progress[`${statistic?.key}`]
        });
        this.isLoadingListStatistic = false;
      }
    }
  },
  destroyed(){
    window.removeEventListener("resize", this.handleResize);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/courses/sidebar-module.scss";
</style>
