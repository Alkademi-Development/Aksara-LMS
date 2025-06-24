<template>
  <section id="courses">
      <ContentHeader 
          v-if="user_kind !== 'student' && !isStepProcess"
          title="Daftar Materi" 
          page="courses"
          :actionButtons="actionsButton"
          :classId="classId"
          :userKind="user_kind"
          @onOpenCourseModal="onOpenCourseModal"
      />

      <FilterForms
          :isBusy="isFilterBusy"
          :pagination="pagination"
          :sortItems="sortCoursesFromClass"
          :fields="filterFields"
          :showFilter="false"
          :searchPlaceholder="'Cari berdasarkan nama materi'"
          :isWrap="true"
          :mdSize="10"
          :lgSize="7"
          @clickDropdown="onOpenDropdown"
          @fetchFilters="setFiltersAndFetch"
          @typingSearch="isCourseLoaded = !$event"
      />
  
      <template v-if="isCourseLoaded">
        <template v-if="classCourses?.length > 0">
            <b-alert 
                class="alert__cta d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-4"
                variant="primary"
                :show="classOverview?.userState === 0" 
            >   
                {{ checkStatusClass(classOverview) }}
                <span 
                    v-if="classOverview?.classState?.onRegistration"
                    class="register__cta d-flex align-items-center" 
                    @click="onClickRegisterCta"
                >
                    Daftar Sekarang <i class="arrow__icon ri-arrow-right-s-line"></i>
                </span>
            </b-alert>

            <div class="row mb-6" style="gap: 24px 0px">
                <template v-for="(item, index) in classCourses">
                    <CardMaterial 
                      :data="item"
                      :key="index"
                      :isActionAddModule="true"
                      :isFromClass="!isStepProcess"
                      :isCreateClass="isStepProcess"
                      :classroomTimelineState="classOverview?.classState"
                      @onEdit="onEditCourse($event)"
                      @onDelete="toggleRemoveCourse"
                      @addModule="onCreateModule($event)"
                      @actionLockedCourse="setEventAlert($event)"
                    />
                </template>
                <!-- <template v-for="index in 4">
                    <div :key="index" v-if="isMateriLoadMore" class="col-12 col-lg-3">
                        <div style="height: 330px;">
                            <b-skeleton-img height="330px"></b-skeleton-img>
                        </div>
                    </div>
                </template> -->
            </div>
        </template>
        <template v-else-if="!this.servicesState?.classroomDetail?.registered && role === 'student'">
            <b-card class="border">
                <b-row>
                    <b-col>Anda tidak terdaftar dikelas ini.</b-col>
                </b-row>
            </b-card>
        </template>
        <template v-else>
            <b-card class="border">
                <b-row>
                    <b-col>Belum Ada Materi</b-col>
                </b-row>
            </b-card>
        </template>
      </template>
      <div v-else class="row">
        <div v-for="index in 4" :key="index" class="col-12 col-lg-3">
          <div style="height: 330px;">
            <b-skeleton-img height="330px"></b-skeleton-img>
          </div>
        </div>
      </div>

      <!-- <ModalCreateCourse
          hideFooter
          isFromClass
          size="md" 
          title="Pilih Materi Yang Sudah Ada" 
          :isNewCourse="false"
          :classroomId="classId" 
          :vModel="openModalCourse" 
          @vModelChange="openModalCourse = $event"
          @submitted="getClassCourse()"
      /> -->

      <ModalMultipleAddItem
        title="Pilih Materi Yang Sudah Ada"
        :onOpenModal="openModalCourse"
        :isBusy="isCourseBusy"
        :fields="courseTableFields"
        :items="courseTableItems"
        :pagination="courserPagination"
        :totalModules="totalCourses"
        @selectedItemsChanged="selectedItemsChanged"
        @onChangePage="onPaginateChanged"
        @onSearch="onSearch"
        @onSave="onAddMultipleModule"
      />
      
      <!-- <b-modal 
          v-model="isConfirmRemoveCourse" 
          size="md" 
          centered 
          hide-header 
          hide-footer 
          body-class="p-0"
      >
          <ModalConfirmation
              title="Peringatan!"
              :description="`<p>Apakah anda yakin akan menghapus materi <strong>${selectedCourse?.title}</strong> ini?</p>`"
              btnYesVariant="danger"
              @actionYes="onRemoveCourse"
              @actionNo="isConfirmRemoveCourse = false"/>
      </b-modal> -->
      
      <b-modal 
          v-model="isConfirmRemoveCourse" 
          size="md" 
          centered 
          hide-header 
          hide-footer 
          body-class="p-0"
      >
          <ModalConfirmation
              title="Peringatan!"
              :description="`<p>Apakah anda yakin akan menghapus materi <strong>${selectedCourse?.title}</strong> ini?</p>`"
              btnYesVariant="danger"
              @actionYes="onRemoveCourse"
              @actionNo="isConfirmRemoveCourse = false"/>
      </b-modal>
      
      <b-modal 
          v-model="isConfirmRemoveModule" 
          size="md" 
          centered 
          hide-header 
          hide-footer 
          body-class="p-0"
      >
          <ModalConfirmation
              title="Peringatan!"
              :description="`<p>Apakah anda yakin akan menghapus modul <strong>${selectedModule?.title}</strong> ini?</p>`"
              btnYesVariant="danger"
              @actionYes="onRemoveModule"
              @actionNo="isConfirmRemoveModule = false"/>
      </b-modal>
      <b-modal v-model="isConfirmEnroll" size="md" centered hide-header hide-footer body-class="p-0">
          <ModalConfirmation
              title="Konfirmasi Pendaftaran!"
              :description="`<p class='text-break'>Apakah anda yakin akan mendaftar di kelas <strong>${ classOverview?.name }</strong>?</p>`"
              btnYesVariant="primary"
              btnNoVariant="danger"
              :btnYesTitle="`${modalLoading ? 'Proses mendaftar kelas...' : 'Ya, Saya Yakin'}`"
              :btnYesDisabled="modalLoading"
              :btnNoHide="modalLoading"
              :footerMessage="classOverview?.level > 1 ? `<p class='danger-message'>*Kamu harus mengikuti <span class='text-primary'>Kelas Persiapan</span> dulu nih` : ''"
              @actionYes="btnModalAction(true)"
              @actionNo="btnModalAction(false)"/>
      </b-modal>
      <b-modal v-model="isCannotRegister" size="md" centered hide-header hide-footer body-class="p-0">
          <ModalConfirmation
              title="Maaf, Kamu Belum Bisa Mendaftar di Kelas ini :("
              :description="registErrMessage"
              btnYesVariant="primary"
              btnYesTitle="OK"
              :btnNoHide="true"
              @actionYes="isCannotRegister = false"/>
      </b-modal>
      <b-modal v-model="finishPreparationClass" size="md" centered hide-header hide-footer body-class="p-0">
          <ModalConfirmation
              title="Maaf, Kamu Belum Bisa Mendaftar di Kelas ini :("
              :description="
                  `<p class='text-break'>
                      Kamu harus menyelesaikan 
                      <span class='text-danger'>Kelas ${classOverview?.level === 3 ? 'Online' : classOverview?.level === 2 ? 'Persiapan' : ''}</span>
                      dulu
                  </p>`
              "
              btnYesVariant="danger"
              btnYesTitle="Oke, Aku Selesaikan"
              :btnYesDisabled="modalLoading"
              btnNoHide
              @actionYes="btnModalFinishPreparationClass()" 
          />
      </b-modal>
      <b-modal
        v-model="onEvent.isShow"
        size="md" 
        centered 
        hide-header 
        hide-footer
      >
        <ModalAlert
          :title="onEvent?.title"
          :description="onEvent?.description"
          :icon="onEvent?.icon"
          :typeOfAlert="onEvent?.typeOfAlert"
        />
      </b-modal>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';

import ModalConfirmation from '~/components/template/micro/modal/ModalConfirmation.vue';
import ModalCreateCourse from '~/components/template/micro/modal/ModalCreateCourse.vue';
import ContentHeader from '../micro/ContentHeader.vue';
import CardMaterial from "@/components/template/micro/card/CardMaterial.vue";
import FilterForms from '../micro/FilterForms.vue';
import ModalAlert from '@/components/template/micro/modal/ModalAlert.vue';
import ModalMultipleAddItem from '~/components/template/micro/modal/ModalMultipleAddItem.vue';

import { toEncrypt } from '~/commons/utils';

import { SORT_COURSES_FROM_CLASS } from '@/commons/constants/filters'
import { FIELDS_FILTER_ASSIGNMENT } from '@/commons/constants/forms';
import { TABLE_SELECT_COURSE } from '~/commons/constants/course';

export default {
  components: { 
      ContentHeader, 
      ModalConfirmation, 
      ModalCreateCourse,
      CardMaterial,
      FilterForms,
      ModalAlert,
      ModalMultipleAddItem
  },
  props: {
      classId: {
          type: Number,
      },
      classSlug: {
          type: String,
          default: ''
      },
      classOverview: {
          type: Object,
          default: {}
      },
      isStepProcess: {
          type: Boolean,
          default: false
      }
  },
  data() {
      return {          
          alertMessage: "",
          alertStatus: false,
          
          activeCourseIndex: null,
          activeCourseId: null,
          activeCourseSlug: null,

          courseSlug: [],

          statusCourse: false,
          actionsButton: [
              { 
                  text: 'Materi', 
                  class: 'btn btn-primary m-0', 
                  type: 'dropdown',
                  iconClass: 'ri-add-fill',
                  dropdownItem: [
                      { text: `Pilih Dari List Materi`, type: 'action', to: 'onOpenCourseModal' },
                      { text: 'Buat Materi Baru', type: 'link', to: `/dashboard/classroom/${this.classSlug}/course/create` }
                  ],
                  classId: this.classId
              }
          ],
          
          isConfirmRemoveCourse: false,
          openModalCourse: false,
          
          isConfirmRemoveModule: false,
          
          classCourses: [],
          isCourseLoaded: false,
          selectedCourse: {},
          
          classModule: [],
          isModuleLoaded: false,
          selectedModule: {},
          isConfirmEnroll: false,
          modalLoading: false,
          isCannotRegister: false,
          registErrMessage: "",
          finishPreparationClass: false,

          isFilterBusy: true,
          pagination: {
              page: 1,
              perPage: 10,
              totalItems: 0,
              totalPages: 1,
          },
          sortCoursesFromClass: SORT_COURSES_FROM_CLASS,
          filterFields: FIELDS_FILTER_ASSIGNMENT,
          lastFiltered: null,
          user: null,
          moduleCounterList: null,
          onEvent: {
            title: "",
            description: "",
            icon: "",
            typeOfAlert: "", // danger, success, warning, ....
            isShow: false,
          },
          role: localStorage.getItem("user_kind"),
          courseTableFields: [...TABLE_SELECT_COURSE],
          courseTableItems: [],
          tempCourseIds: [],
          selectedMultipleCourse: this.classOverview?.modules ?? [],
          courserPagination: {
            page: 1,
            perPage: 10,
            totalItems: 0,
            totalPages: 0,
          },
          totalCourses: this.classOverview?.modules?.length ?? this.selectedMultipleCourse?.length ?? 0,
          isCourseBusy: true,
          tempCourseSearch: ''
      }
  },
  watch: {
      activeCourseIndex() {
          this.statusCourse = false
          
          this.setActiveCourseId()
          this.scrollToModuleActive();

          if (this.activeCourseSlug !== null) {
              this.getModules({ classroomSlug: this.classSlug, moduleSlug: this.activeCourseSlug })
                  .then(() => { 
                      this.classModule = this.modules
                      this.statusCourse = true })
          }       
      },
      openModalCourse() {
        if (this.openModalCourse) {
            this.tempCourseSearch = ''
            this.fetchModules(1, null)
        }
      }
  },
  computed: {
      ...mapState({
          courses: (state) => state.Services?.modules,
          modules: (state) => state.Services?.topics,
          responseStatus: (state) => state.Services?.status,
          responseMessage: (state) => state.Services?.message,
          user_kind: (state) => state.Auth?.user_kind,
          isTestCase: (state) => state.Sass?.isTestCase,
          servicesState: (state) => state.Services,
          classroomsState: (state) => state.Classrooms
      }),
  },
  created(){
      this.getClassCourse()
  },
  methods: {
      ...mapActions({
          getCourses: 'Services/classroomModules',
          getModules: 'Services/classroomTopics',
          removeCourse: 'Services/classroomDeleteModule',
          removeModule: 'Services/deleteTopic',
          setActiveTab: 'Layouts/setActiveTab',
          getModuleCounterList: 'Classrooms/getModuleCounterList',
          getListModules: 'Classrooms/getListModules',
      }),

      async fetchModules(page = 1, search = null) {
        this.courseTableItems = []
        await this.$store.dispatch('Services/modules', { page, type: null, search })

        if (!this.servicesState.status) {
            console.error('Failed fetch modules', this.servicesState.message)
            this.isCourseBusy = false
        } else {
            const modules = this.servicesState.modules ?? []
            const moduleItems = modules.map((item) => {
                const module = {...item}
                module.authorName = item?.author?.name ?? 'Mentor'
                module.modulCount = item?.courses ?? 0
                module.latestUpdate = moment(item?.updated_at).format('DD MMM YYYY')
                module.checked = this.tempCourseIds.includes(item?.id) || this.selectedMultipleCourse.includes(item?.id)

                return module
            })

            this.courseTableItems = moduleItems

            this.courserPagination = this.servicesState.pagination
            this.isCourseBusy = false
        }
      },
      selectedItemsChanged(modules = []) {
        modules?.forEach(module => {
            const findModuleIdx = this.selectedMultipleCourse.findIndex(moduleId => moduleId == module?.id)
            if (!module?.checked && this.selectedMultipleCourse.includes(module?.id)) this.selectedMultipleCourse.splice(findModuleIdx, 1)
            else if (module?.checked && !this.selectedMultipleCourse.includes(module?.id)) this.selectedMultipleCourse.push(module?.id)
        })

        this.totalCourses = this.selectedMultipleCourse?.length ?? 0
    },
    onPaginateChanged(val) {
        this.isCourseBusy = true
        this.fetchModules(val, this.tempCourseSearch)
    },
    onSearch(val) {
        this.isCourseBusy = true
        this.tempCourseSearch = val
        this.fetchModules(1, val)
    },
    async onAddMultipleModule() {
        const params = {
            classroomId: this.classOverview?.id,
            moduleIds: [...this.selectedMultipleCourse]
        }

        await this.$store.dispatch('Services/classroomAssignModules', { params })
        if (!this.servicesState.status) {
            console.error('Failed add modules', this.servicesState.message)
        } else {
            this.openModalCourse = false
            this.$emit('onFetchClassroomDetail', { slug: this.classOverview?.slug })
            this.getClassCourse()
        }
    },

      setEvent(message, status) {
          this.alertMessage = message
          this.alertStatus = status
      },
      setEventAlert({title, description, icon, typeOfAlert, isShow}){
        this.onEvent = {
          title,
          description,
          icon,
          typeOfAlert,
          isShow,
        }
      },

      getClassCourse(search = null, sort = null) {
        this.isCourseLoaded = false
          this.getListModules({ classroomSlug: this.classSlug, keyword: search, sort }).then(() => {
            this.user = JSON.parse(localStorage.getItem("user"));
            this.classCourses = this.classroomsState?.listModules;
            this.tempCourseIds = this.classCourses?.map(course => course?.id) ?? []
            this.selectedMultipleCourse = [...this.tempCourseIds]
            this.totalCourses = this.tempCourseIds?.length ?? 0
            
            if (this.activeCourseIndex === null || this.activeCourseId === null) {
                const moduleId = this.$route.hash ? parseInt(this.$route.hash.split("-")[1]) : 0;
                this.activeCourseIndex = moduleId == 0 ? 0 : this.classCourses.findIndex(obj => obj.id == moduleId);
                if(this.classCourses?.length == 1){
                    this.activeCourseId = this.classCourses[0].id
                    this.activeCourseSlug = this.classCourses[0].slug
                    this.statusCourse = true
                }
            }

            if(this.role === 'student'){
              this.getModuleCounterList({ classroomSlug: this.classSlug, userId: this.user?.id }).then(() => {
                this.moduleCounterList = this.classroomsState?.moduleCounterList;
                if (!this.isStepProcess) {
                    // Match the counter with the class course, and add progress, totalCompletion, totalTopics to class course
                    if(this.classCourses && this.classCourses?.length > 0 && this.moduleCounterList && this.moduleCounterList?.length > 0){
                      this.classCourses.map((course) => {
                        this.moduleCounterList.map((counter) => {
                          if(counter?.id === course?.id){
                            course.progress = counter?.progress;
                            course.totalCompletion = counter?.totalCompletion;
                            course.totalTopics = counter?.totalTopics;
                          }
                        })
                      })
                    }
                }

                if (!this.classOverview?.modules || this.classOverview?.modules?.length < 1) this.$emit('onChangePage')
                this.$emit('onChangeCourses', this.classCourses)
                this.isCourseLoaded = true
              })
            }else{
              if (!this.classOverview?.modules || this.classOverview?.modules?.length < 1) this.$emit('onChangePage')
              if (this.classCourses?.length == this.classOverview?.modules?.length) this.$emit('onChangeCourses', this.classCourses)
              this.isCourseLoaded = true
            }
          })
      },
      isCoverImage(url) {
        if (url) {
          const imageExtensionRegex =
            /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
          return imageExtensionRegex.test(url);
        }
      },
      setActiveCourseId() {
          this.courses?.map((course, idx) => {
              if (this.activeCourseIndex === idx) {
                  this.activeCourseId = course.id
                  this.activeCourseSlug = course.slug
              }
          })
      },
      btnModalAction(action) {
          if (action) this.enrollClass(this.classOverview?.code)
          else this.isConfirmEnroll = !this.isConfirmEnroll
      },
      onClickRegisterCta() {
          let res = 'classroom'
          if (this.user_kind == 'student') {
              if (this.isTestCase) res = 'tes/assignments'
              if (this.classOverview.registered) this.$router.push(`/dashboard/${res}/${this.classOverview.id}`);
              else {
                  this.isLoaded = true
                  if (this.classOverview?.meetLevels) {
                      if (this.classOverview.requirementFields.length != 0) this.$router.push(`/dashboard/classroom/requirements/${this.classOverview.slug}`)
                      else this.isConfirmEnroll = true
                  }else {
                      this.finishPreparationClass = true
                  }
              }
          } else {
              if (this.isTestCase) res = 'tes'
              this.$router.push(`/dashboard/${res}/${this.classOverview.id}`);
          }
      },
      btnModalFinishPreparationClass() {
          this.finishPreparationClass = false
          this.$router.push('/dashboard/')
      },
      async enrollClass(code) {
          this.modalLoading = true
          const params = {code: code}
          await this.$store.dispatch('Services/classroomEnroll', params)
          if (!this.servicesState.status) {
              console.error('failed to enroll classroom: ', this.servicesState.message)
              this.setEvent(this.servicesState.message, false)

              this.modalLoading = false
              this.isConfirmEnroll = !this.isConfirmEnroll
              this.registErrMessage = this.servicesState.message
              const errPreClassMessage = "Anda belum mendaftar kelas prasyarat!";

              if(this.classOverview?.preClass && (this.registErrMessage.toLowerCase() == errPreClassMessage.toLowerCase())){
                this.registErrMessage = `<p>Anda belum mendaftar kelas prasyarat <a class='nav-prasyarat' href='/dashboard/classroom/${this.classOverview?.preClass?.slug}' style='color: var(--bs-primary); font-size: 14px;'>${this.classOverview?.preClass?.name}!</a></p>`
              }

              if (this.classOverview?.schools?.length > 0) {
                  this.registErrMessage = "<p>Sekolahmu belum terdaftar di program ini!<br>Untuk mengikuti program ini, hubungi Admin SMK Coding melalui : <br><br>WhatsApp <a href='https://wa.me/6282131362595' target='_blank'>admin</a><br>Instagram <a href='https://instagram.com/smkcoding.id' target='_blank'>@smkcoding.id</a>, atau<br>Email <a href='mailto:admin@smkcoding.id'>admin@smkcoding.id</a></p>"
              }
              this.isCannotRegister = true
          } else {
              setTimeout(() => {
                  this.modalLoading = false
                  this.btnModalAction(false)
                  this.$emit('fetchOverview')
                  if (this.classOverview?.type !== 'tes') this.setActiveTab('courses')
              }, 1000);

          }

      },
      onClickCourse(idx) {
          this.activeCourseIndex === idx ? this.activeCourseIndex = null : this.activeCourseIndex = idx
      },
      onClickDetailModule(course, module){
          localStorage.setItem('courseId', toEncrypt(course?.id))
          localStorage.setItem('moduleId', toEncrypt(module?.id))
          
          let path = `/dashboard/classroom/${this.classSlug}/course/${course?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/module/${module?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`
          
          if(this.classOverview.userState === 0) return 
          this.$router.push({
              path: path,
          })
      },
      onOpenCourseModal() {
          this.openModalCourse = !this.openModalCourse
      },
      onEditCourse(course){
          localStorage.setItem('courseId', toEncrypt(course?.id))
          this.$router.push({
              path: `/dashboard/classroom/${this.classSlug}/course/${course?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit`,
          })
      },
      onEditModule(module, course){
          localStorage.setItem('classId', toEncrypt(this.classId))
          localStorage.setItem('moduleId', toEncrypt(module?.id))
          localStorage.setItem('courseId', toEncrypt(course?.id))

          this.$router.push({
              path: `/dashboard/classroom/${this.classSlug}/module/${module?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit`,
          })
      },

      summaryText(value) {
          const regexCharsHtml = /(<([^>]+)>)/gi;
          const descriptionContent = value.replace(regexCharsHtml, "")
          if(descriptionContent.length > 160) {
              let descriptionSummary = descriptionContent.substring(0, 160);
              return descriptionSummary.match(/[,!@#$%^&*()]\s*$/) ? descriptionContent.substring(0, 160).slice(0, -1) + '.' : descriptionContent.substring(0, 160);
          }

          return descriptionContent + '.'
      },
      toggleRemoveCourse(course) {
          this.isConfirmRemoveCourse = !this.isConfirmRemoveCourse
          
          if (this.isConfirmRemoveCourse) this.selectedCourse = course
          else this.selectedCourse = null
      },
      async onRemoveCourse() {
          this.isCourseLoaded = false
          const params = {
              moduleUUID: this.selectedCourse?.uuid,
              classroomSlug: this.classSlug
          }
          
          await this.removeCourse(params)

          if(!this.responseStatus) {
              console.error('Failed remove course from classroom', this.responseMessage)

              this.setEvent(this.responseMessage, false)
              this.isCourseLoaded = true
          } else {
              this.isConfirmRemoveCourse = false

              this.getClassCourse()
          }
      },
      
      toggleRemoveModule(module) {
          this.isConfirmRemoveModule = !this.isConfirmRemoveModule
          
          if (this.isConfirmRemoveModule) this.selectedModule = module
          else this.selectedModule = null
      },
      async onRemoveModule() {

          this.removeModule(this.selectedModule?.id)

          if(!this.responseStatus) {
              console.error('Failed remove module from classroom', this.responseMessage)

              this.setEvent(this.responseMessage, false)
          } else {
              this.isConfirmRemoveModule = false
              
              this.getModules({ classroomSlug: this.classSlug, moduleSlug: this.activeCourseSlug })
          }
      },

      onCreateModule(course) {
          localStorage.setItem('courseId', toEncrypt(course?.id))
          localStorage.setItem('classId', toEncrypt(this.classId))
          this.$router.push(`/dashboard/classroom/${this.classSlug}/module/create`)
      },

      checkStatusClass(dataOverview){
          if(dataOverview?.classState?.comingSoon) return "Pendaftaran Belum dibuka."
          if(dataOverview?.classState?.onRegistration) return "Daftar kelas ini untuk membuka course modul. "
          if(dataOverview?.classState?.ended || dataOverview?.classState?.started) return "Pendaftaran ditutup."
      },
      scrollToModuleActive(){
          const moduleId = this.$route.hash ? this.$route.hash.split("#")[1] : '';
          if(moduleId !== ''){
              this.$nextTick(() => {
                  const elementActive = document.getElementById(`${moduleId}`);
                  if(elementActive){
                      elementActive.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                      })
                  }
              })
          }
      },
      onOpenDropdown() {
          this.getClassCourse()
      },
      setFiltersAndFetch({page, perPage, sortBy, search}) {
        this.getClassCourse(search, sortBy)
      },
  },
  beforeDestroy(){
      const pathWithoutHash = this.$route.fullPath.split("#")[0]; 
      this.$router.push({ path: pathWithoutHash });
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/components/classroom/courses.scss';
  .description {
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
  }

  .lock__icon {
      font-size: 24px;
  }
  
  .alert__cta {
      gap: 2px;
      .register__cta {
          width: fit-content;
          gap: 4px;
          font-weight: 600;
          cursor: pointer;
          color: #FFF;
          
          .arrow__icon {
              line-height: 100%;
              font-size: 16px;
          }

          &:hover {
              text-decoration: underline;
          }
      }
  }
</style>
