<template>
  <div>
    <Split class="h-100">
      <SplitArea :size="33" :minSize="100">
          panel left
      </SplitArea>
      <SplitArea :size="33" :minSize="100">
          panel center
      </SplitArea>
      <SplitArea :size="33" :minSize="300">
          panel right
      </SplitArea>
    </Split>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Split, SplitArea } from 'vue-split-panel';
import useAuthMixin from '~/mixins/useAuthMixin';
import Sidebar from '~/components/template/metronom/Sidebar.vue';
import ModuleIFrame from '~/components/template/metronom/ModuleIFrame.vue';

export default {
  components: {
    Sidebar,
    ModuleIFrame,
    Split,
    SplitArea,
  },
  layout: 'metronom',
  asyncData({ redirect, query }) {
    const metronomId = query?.metronomId;
    // if (!metronomId) {
    //   redirect('/auth')
    // }

    return { metronomId }
  },
  mixins: [useAuthMixin],
  data() {
    return {
      isLoading: true,
      isModuleOpen: false,
      activeScreen: 'editor',
      activeEditor: null,
      project: {
        name: 'Proyek Dummy',
      },
      modules: [
        { id: 1, name: 'Module 1', description: 'Deskripsi modul 1' },
        { id: 2, name: 'Module 2', description: 'Deskripsi modul 2' },
        { id: 3, name: 'Module 3', description: 'Deskripsi modul 3' },
      ],
    }
  },
  computed: {
    ...mapState({
      authState: (state) => state.Auth,
      compilerState: (state) => state.Compiler,
    })
  },
  mounted() {
    this.initialCompiler();
  },
  methods: {
    ...mapActions({
        getAppVersion: 'Auth/getAppVersion',
        validateAppToken: 'Auth/validateAppToken',
        getUserDetail: 'Auth/getUserDetail',
        getServerTime: 'Alkamedia/getServerTime',
        getExt: 'Alkamedia/getExt',
        getDetailProject: 'Compiler/getDetailProject',
        setModuleOpen: 'Studio/setModuleOpen',
    }),
    setModuleOpen(value) {
      this.isModuleOpen = value;
    },
    async initialCompiler() {

      await this.getDetailProject(this.metronomId)

      // console.log(this.compilerState)

    }
  },
}
</script>

<style lang="scss" scoped>
</style>