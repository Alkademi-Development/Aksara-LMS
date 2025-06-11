<template>
  <div class="col-12 col-md-6 col-lg-4">
    <div class="card bg-white cursor-pointer mb-0 h-100" @click="detailMateri(data)">
      <div :class="`wrapper-header position-relative overflow-hidden ${isCoverImage ? 'border' : ''}`" :style="{'background-color': !isCoverImage ? data?.cover || '#EFECF4' : '' }">
        <template v-if="isCoverImage">
          <b-img-lazy
            :src="data?.cover"
            :alt="`cover-${data?.title}`"
            class="w-100 h-100"
            style="object-fit: cover"
            fluid
            blank-color="#D9D9D9"
          />
        </template>
        <div
          v-if="(data?.editable && isCreateClass) || (isFromClass && (role !== 'student') && (role !== 'teacher'))"
          class="btn-action bg-white rounded d-flex justify-content-center align-items-center position-absolute p-2 mt-2 mr-2 cursor-pointer"
          style="top: 0; right: 0; border-color: rgb(157, 157, 157) !important; z-index: 99;"
          @click="deleteMateri"
        >
          <i class="ri-delete-bin-7-line text-danger" style="font-size: 18px;"></i>
        </div>
        <div v-if="role === 'student' && !isModuleCanAccess" :class="`wrapper-lock-course ${isCoverImage ? 'lock-image' : ''}`">
          <i class="ri-lock-line" style="font-size: 24px;"></i>
        </div>
        <div v-if="data?.owned && getActiveTab === 'library'" class="position-absolute bg-white d-flex justify-content-center align-items-center rounded-circle" style="top: 10px; right: 10px; width: 24px; height: 24px">
          <i class="ri-checkbox-circle-fill" style="font-size: 20px;"></i>
        </div>
      </div>
      <div class="wrapper-body-solid d-flex flex-wrap align-content-between flex-grow-1 gap-3">
        <div class="title-material">
          <h5 class="text-limit limit-1">{{ data.title }}</h5>
        </div>
        <div :class="`w-100 d-flex flex-column gap-4`">
          <div :class="`align-items-center ${(!data?.author || !data?.author?.name) ? isFromClass ? 'd-none' : 'd-flex justify-content-end' : 'justify-content-between d-flex'} gap-3`">
            <div v-if="data?.author || data?.author?.name" class="wrapper-container d-flex align-items-center" style="gap: 10px">
              <img v-if="data?.author?.photo" :src="data?.author?.photo" class="rounded-circle author-photo" style="width: 32px; height: 32px; object-fit: cover;" />
              <div v-else class="rounded-circle d-flex justify-content-center align-items-center text-white author-photo-default" style="width: 32px; height: 32px;">{{ setDefaultProfil(data?.author?.name) }}</div>
              <h5 class="text-limit limit-1">{{ data?.author?.name }}</h5>
            </div>
            <div v-if="getActiveTab === 'library'" class="price">
              <p class="mb-0">{{ data?.price == 0 ? 'Free' : '' }}</p>
            </div>
          </div>
          <div v-if="role === 'student' && !isModuleCanAccess">
            <div class="w-100 bg-gray rounded text-white py-2 text-center btn-action-course">Terkunci</div>
          </div>
          <div v-else-if="role === 'student' && (data?.totalCompletion == 0 || !data?.totalCompletion) && isStudentRegisteredClass">
            <div class="w-100 bg-primary rounded text-white py-2 text-center btn-action-course">Mulai Belajar</div>
          </div>
          <div v-else-if="role === 'student' && isStudentRegisteredClass">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <p class="mb-0 font-weight-bold">{{ data?.progress || '-' }}%</p>
              <p class="mb-0"><span class="font-weight-bold">{{ data?.totalCompletion || '-' }}</span>/{{ data?.totalTopics || '-' }} modul</p>
            </div>
            <b-progress :value="data?.progress" :max="100" class="mb-0" variant="primary"></b-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toEncrypt } from '~/commons/utils'
import { mapState } from 'vuex';

export default {
  props: {
    data: {
      type: Object,
      default: {},
    },
    isActionAddModule: {
      type: Boolean,
      default: false,
    },
    isFromClass: {
      type: Boolean,
      default: false,
    },
    isCreateClass: {
      type: Boolean,
      default: false,
    },
    classroomTimelineState: {
      type: Object,
      default: () => {},
    }
  },
  computed: {
      ...mapState({
          getActiveTab: (state) => state?.Layouts?.activeTab,
          classroomsState: (state) => state.Classrooms,
          servicesState: state => state.Services,
      }),
      isModuleCanAccess(){
        return this.role === 'student' ? this.classroomTimelineState?.started || this.classroomTimelineState?.ended : true; 
      },
      isCoverImage(){
        return this.data.isImage || this.data?.cover?.startsWith('http');
      },
      isStudentRegisteredClass(){
        return this.servicesState?.classroomDetail?.registered;
      }
  },
  data(){
    return{
      role: null,
      valueOfTabs: [
        { name: "library", navigateToDetail: "/dashboard/courses/modules/" },
        { name: "myCourses", navigateToDetail: "/dashboard/courses/my-courses/modules/" },
        { name: "draft", navigateToDetail: "/dashboard/courses/draft/modules/" }
      ]
    }
  },
  mounted(){
    this.role = localStorage.getItem("user_kind");
  },
  methods: {
    edit(){
      this.$emit("onEdit", this.data);
    },
    deleteMateri(event){
      event.stopPropagation();
      this.$emit("onDelete", this.data);
    },
    async detailMateri(item){
      if (!this.isCreateClass) {
        // if(item?.locked && this.role === 'student' || !this.isModuleCanAccess){
        if(this.role === 'student' && !this.isModuleCanAccess){
          const message = {
            title: "Materi Terkunci",
            description: !this.isModuleCanAccess ? "Kelas belum dimulai, silakan tunggu hingga waktu yang ditentukan untuk membuka materi." : "Anda belum menyelesaikan materi sebelumnya!",
            icon: "ri-error-warning-fill",
            typeOfAlert: "danger",
            isShow: true,
          }
          this.$emit("actionLockedCourse", message);
        }else{
          if(item?.slug){
            this.$store.commit("Courses/SET_IS_MOVE_MODULE", false);
            const detailClassroom = this.$store?.state?.Services?.classroomDetail;
    
            localStorage.setItem('courseId', toEncrypt(item.id))
            localStorage.setItem('courseUUID', toEncrypt(item?.uuid))
            
            if(this.isFromClass){
              await localStorage.removeItem("timerTopic");
              this.$router.push(`/dashboard/classroom/${detailClassroom?.slug}/course/${item?.slug}`);
            }
            // if(this.isFromClass) this.$router.push(`/dashboard/classroom/${detailClassroom?.slug}/module/${item?.slug}`)
            else{
              const currentTab = this.valueOfTabs.find(tab => tab?.name == this.getActiveTab);
              this.$router.push(currentTab?.navigateToDetail + item?.slug);
            }
          }
        }
      }
    },
    setDefaultProfil(name){
      if(name) return name[0].toUpperCase();
      // console.log(name[0], 138);
    },
    addModule(item){
      this.$emit("addModule", item);
    }
  }
}
</script>


<style scoped lang="scss">
@import '@/assets/scss/components/courses/card-material.scss';
</style>