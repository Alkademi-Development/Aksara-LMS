<template>
  <div :class="`d-flex align-items-center ${prevTopic?.active && nextTopic?.active ? 'justify-content-between' : prevTopic?.active && !nextTopic?.active ? 'justify-content-between' : !prevTopic?.active && nextTopic?.active ? 'justify-content-end' : 'justify-content-between'}`">
    <template v-if="isLoaded">
      <div v-if="prevTopic?.active" class="d-flex align-items-center justify-content-center gap-2 bg-white border btn-prev rounded cursor-pointer" @click="onClickAction(prevTopic)">
        <i class="ri-arrow-left-s-line"></i>
        <p class="mb-0 text-limit limit-1">{{ prevTopic?.isOverview ? 'Overview' : prevTopic?.topic?.title }}</p>
      </div>
      <div class="d-flex gap-4">
        <div v-if="isShowButtonScroll" class="bg-white border rounded d-flex justify-content-center align-items-center btn-scroll-to-top cursor-pointer" @click="scrollToTop">
          <i class="ri-arrow-up-s-line"></i>
        </div>
        <div v-if="nextTopic?.active && role !== 'student'" class="d-flex align-items-center justify-content-center gap-2 bg-primary border rounded btn-next cursor-pointer" @click="onClickAction(nextTopic)">
          <p class="mb-0 text-white text-limit limit-1">{{ nextTopic?.isCourse ? `Materi Selanjutnya : ${nextTopic?.course?.title}` : nextTopic?.isModuleDone ? nextTopic?.text : nextTopic?.topic?.title }}</p>
          <i class="ri-arrow-right-s-line text-white"></i>
        </div>
        <div v-if="(nextTopic?.active && role === 'student') || (!isTimerTopicDone && nextTopic?.isLastTopic)" class="d-flex align-items-center justify-content-center gap-2 bg-primary border rounded btn-next cursor-pointer" @click="onClickAction(nextTopic)">
          <template v-if="nextTopic?.active && role === 'student'">
            <p class="mb-0 text-white text-limit limit-1">{{ nextTopic?.isCourse ? `Materi Selanjutnya : ${nextTopic?.course?.title}` : nextTopic?.isModuleDone ? nextTopic?.text : nextTopic?.topic?.title }}</p>
            <i class="ri-arrow-right-s-line text-white"></i>
          </template>
          <p v-if="!isTimerTopicDone && topicLocked?.showTimerIn === 'footer' && currentTopic?.typeOfList !== 'assignment' && !currentTopic?.topic?.readed" class="mb-0 text-white">{{ timerTopic }}</p>
        </div>
      </div>
    </template>
    <template v-else>
      <b-skeleton type="button"></b-skeleton>
      <b-skeleton type="button"></b-skeleton>
    </template>
  </div>
</template>

<script>
import { toEncrypt } from '~/commons/utils';
import { mapState } from 'vuex';

export default {
  props: {
    isLoaded: {
      type: Boolean,
      default: false,
    },
    prevTopic: {
      type: Object,
      default: {}
    },
    nextTopic: {
      type: Object,
      default: {},
    },
    isFromClass: {
      type: Boolean,
      default: false
    },
    isShowButtonScroll: {
      type: Boolean,
      default: true,
    },
    timerTopic: {
      type: Number,
    },
    isScrollReachedBottom: {
      type: Boolean,
      default: false,
    },
    currentTopic: {
      type: Object,
      default: () => {},
    },
    topicLocked: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
      ...mapState({
          moduleCounterState: (state) => state?.Classrooms?.moduleCounter,
      }),
      isTimerTopicDone(){
        const totalCompletion = this.moduleCounterState?.totalCompletion;
        const totalTopics = this.moduleCounterState?.totalTopics;
        return this.timerTopic == 0 || (totalCompletion == totalTopics);
      },
  },
  data(){
    return{
      role: localStorage.getItem("user_kind"),
    }
  },
  methods: {
    scrollToTop(){
      window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
    },
    onClickAction(item){
      this.$store.commit("Courses/SET_IS_MOVE_MODULE", true);
      if(this.isFromClass){
        const classroomSlug = this.$route?.params?.classroom;
        const moduleSlug = this.$route?.params?.course;
        if(item?.typeOfList === 'overview'){
          localStorage.removeItem("topic");
          this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}`);
        }else{
          if(item?.typeOfList === 'assignment'){
            this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/assignment/${item?.data?.slug}`);
          }else if(item?.typeOfList === 'course'){
            if(this.role === 'student' && item?.topic?.locked){
              this.$emit("onActionModuleLocked", item);
            }else{
              if(this.role === 'student' && item?.isModuleDone) this.$emit("onActionModuleDone", item);
              else{
                this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${moduleSlug}/module/${item?.topic?.slug}`);
              }
            }
          }else{
            const course = item?.course;
            this.$store.commit("Courses/SET_IS_MOVE_MODULE", false);

            localStorage.setItem('courseId', toEncrypt(course.id))
            localStorage.setItem('courseUUID', toEncrypt(course?.uuid))
            localStorage.removeItem("timerTopic");
            this.$router.push(`/dashboard/classroom/${classroomSlug}/course/${course?.slug}`);
          }
        }
      }else{
        const courseSlug = this.$route.params?.courseId;
        if(item?.isOverview)this.$router.push(`/dashboard/courses/modules/${courseSlug}`);
        else this.$router.push(`/dashboard/courses/modules/${courseSlug}/topic/${item?.topic?.slug}`);
      }
      // this.$emit("onClickAction", item);
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-prev, .btn-next{
  padding: 12px;
  max-width: 115px;

  @media (min-width: 576px){
    max-width: 200px;
  }

  @media (min-width: 768px){
    max-width: 115px;
  }

  @media (min-width: 992px){
    max-width: 280px;
  }

  i{
    font-size: 18px;
    font-weight: 600;
  }

  p{
    font-size: 14px;
    font-weight: 600;
  }
}

.btn-scroll-to-top{
  padding: 12px;

  i{
    font-size: 24px;
    font-weight: 600;
  }
}
</style>