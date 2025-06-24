<template>
  <div v-if="isLoaded">
    <div v-if="topicDetail?.content">
      <client-only>
        <tiptap-editor
          :editable="false"
          :content="topicDetail?.content"
          :isPreview="true"
        />
      </client-only>
    </div>
    <div v-else class="w-100 d-flex justify-content-center align-items-center" style="height: 70vh">
      <div class="d-flex flex-column align-items-center" style="gap: 20px;">
        <img src="~/assets/img/icons/empty/no-content.png" width="150px" />
        <h4 style="color: #A2A2A2; text-align: center">Belum ada content pada modul ini</h4>
        <b-button v-if="role === 'superadmin'" variant="outline-primary" @click="addContentModule">Tambahkan Content</b-button>
        <!-- <b-button v-if="role !== 'student'" variant="outline-primary" @click="addContentModule">Tambahkan Content</b-button> -->
      </div>
    </div>
  </div>
  <div v-else class="py-4">
    <div class="d-flex justify-content-center align-items-center mb-5">
      <b-skeleton animation="wave" width="30%"></b-skeleton>
    </div>
    <div class="d-flex justify-content-center align-items-center w-100 mb-5">
      <b-skeleton-img no-aspect width="60%" height="300px"></b-skeleton-img>
    </div>
    <div class="d-flex flex-column gap-2">
      <b-skeleton v-for="index in 3" :key="index" animation="wave" width="100%"></b-skeleton>
      <b-skeleton animation="wave" width="80%"></b-skeleton>
    </div>
  </div>
</template>

<script>
import TiptapEditor from '@/components/editor/micro/TiptapEditor.vue';
import { mapState } from 'vuex';
import { toEncrypt } from '~/commons/utils';

export default {
  components: {
    TiptapEditor,
  },
  props: {
    isLoaded: {
      type: Boolean,
      default: false,
    },
    topicDetail: {
      type: Object,
      default: {},
    }
  },
  computed: {
    ...mapState({
        getActiveTab: (state) => state?.Layouts?.activeTab
    }),
  },
  data(){
    return{
      role: "",
    }
  },
  mounted(){
    this.role = localStorage.getItem("user_kind");
    this.$nextTick(() => {
      this.$emit("callbackLoaded");
    });
  },
  methods: {
    addContentModule(){
      const moduleSlug = this.$route?.params?.courseId;
      const topicSlug = this.topicDetail?.slug;
      const courseId = this.topicDetail?.moduleId;

      localStorage.setItem('courseId', toEncrypt(courseId));

      if(this.getActiveTab === 'library') this.$router.push(`/dashboard/courses/modules/${moduleSlug}/edit/${topicSlug}`);
      else if(this.getActiveTab === 'myCourses') this.$router.push(`/dashboard/courses/my-courses/modules/${moduleSlug}/edit/${topicSlug}`);
    }
  }
}
</script>