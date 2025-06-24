<template>
  <b-form class="row">
      <div class="col-lg-8 card-wrapper" >
          <div class="card" v-if="inputFormBundleContent || inputFormListMateri.length !== 0">
              <div class="card-body" v-if="isLoaded">
                  <b-alert 
                      v-model="onEvent.show"
                      :variant="onEvent.variant"
                      dismissible
                  >
                      {{ onEvent?.message }}
                  </b-alert>
                  <div v-for="(input, index) in activeStep === 'createBundle' ? inputFormBundleContent : inputFormListMateri" :key="index" >
                      <b-form-group
                          v-if="input.type !== 'checkbox' && input.type != 'wysiwyg' && input.type !== 'date' && input.type != 'select' && input.type != 'textarea' && input.type != 'image' && input.type != 'file' && input.name != 'link' && input.type != 'date' && input.type != 'color'"
                          :label="input.label"
                          :label-for="input.label"
                          :description="input.description"
                      >
                          <b-form-input
                              v-model="input.value"
                              :id="input.label"
                              :value="input.value"
                              :type="input.type"
                              :placeholder="input.placeholder"
                              :required='input.required'
                              min="0"
                          ></b-form-input>
                      </b-form-group>

                      <b-form-group
                          v-if="input.type == 'file' && input.name == 'logo'"
                          :label="input.label"
                          :label-for="input.label"
                      >
                          <b-form-file
                              v-model="logo"
                              :state="Boolean(logo)"
                              placeholder="Pilih file atau letakkan di sini..."
                              drop-placeholder="Letakkan di sini..."
                              accept="image/*"
                          ></b-form-file>
                      </b-form-group>

                      <div v-if="input.type == 'image'" class="form-group">
                          <Dropzone 
                              :dropzoneId="input.name" 
                              :label="input.label" 
                              :disabled="input.disabled" 
                              filedir="announcement" 
                              acceptedFiles="image/*" 
                              :value="input.value" 
                              v-model="input.value"
                              :withRemove="true"
                              @input="contentImage = $event"
                              @remove="input.value = null, contentImage = null"/>
                      </div>

                      <!-- <b-form-group
                          v-if="input.type == 'textarea'"
                          :label="input.label"
                          :label-for="input.label"
                          :description="input.description"
                      >
                          <b-form-textarea
                              v-model="input.value"
                              :id="input.label"
                              :value="input.value"
                              :type="input.type"
                              :placeholder="input.placeholder"
                              :required='input.required'
                              rows="7"
                          ></b-form-textarea>
                      </b-form-group> -->

                      <b-form-group
                            v-if="input.type == 'wysiwyg'"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <DescriptionEditor
                              v-model="input.value"
                              :placeholder="input.placeholder"
                            />
                    </b-form-group>

                    <b-form-group
                        v-if="input?.name === 'materi'" 
                        :label="input?.label"
                        :label-for="`checkbox-${input?.name}`">

                        <SearchDropdownCheckbox 
                            :id="`checkbox-${input?.name}`"
                            class="w-100"
                            itemClass="w-100"
                            buttonTitle="Pilih materi"
                            :description="input?.description"
                            :placeholder="input?.placeholder"
                            :items="materiOptions"
                            @onChange="selectedMateri = $event"/>

                    </b-form-group>

                    <b-form-group
                        v-if="input.type == 'color'"
                        :label="input.label"
                        :label-for="input.label"
                        :description="input.description"
                      >

                        <SelectColor 
                            :options="colorTemplate"
                            :value="selectedColor"
                            :contentImage="!!contentImage"
                            @setColor="selectedColor = $event"
                        />

                    </b-form-group>
                  </div>
              </div>
              <div class="card-body text-center" v-else>
                  <b-spinner label="Spinning"></b-spinner>
              </div>
          </div>
      </div>

      <div v-if="isLoaded" class="col-lg-4 card-wrapper">
          <div class="card" v-if="inputFormBundleAttribute.length !== 0 && activeStep !== 'listMateri'">
              <div class="card-body">
                  <div v-for="(input, index) in inputFormBundleAttribute" :key="index" >

                    <b-form-group
                          v-if="input.type !== 'checkbox' && input.type != 'wysiwyg' && input.type !== 'date' && input.type != 'select' && input.type != 'textarea' && input.type != 'image' && input.type != 'file' && input.name != 'link' && input.type != 'date'"
                          :label="input.label"
                          :label-for="input.label"
                          :description="input.description"
                      >
                          <b-form-input
                              v-model="input.value"
                              :id="input.label"
                              :value="input.value"
                              :type="input.type"
                              :placeholder="input.placeholder"
                              :required='input.required'
                              min="0"
                          ></b-form-input>
                      </b-form-group>

                      <b-form-group
                          v-if="input.type === 'checkbox' && input.name === 'active'"
                          :label="input.label"
                          :label-for="input.name"
                          :description="input.description"
                      >
                          <b-form-checkbox
                              v-model="input.value"
                              switch
                              size="lg"
                              :id="input.name"
                              :name="input.name"
                              :required="input.required"
                              :value="1"
                              :unchecked-value="0"
                          > 
                              <p class="mb-0">{{ input.value ? 'Active' : 'Disable' }}</p>
                          </b-form-checkbox>

                      </b-form-group>

                      <b-form-group
                        v-if="input.type == 'select'"
                        :label="input.label"
                        :label-for="input.label"
                        :description="input.description"
                      >

                        <SearchSelect
                          class="w-100"
                          :items="categoriesOptions ?? []"
                          :text="selectedCategory?.label"
                          :placeholder="input?.placeholder"
                          @onChange="selectedCategory = $event"
                          :id="`select-${ input?.name }`"/>

                      </b-form-group>

                      <b-form-group
                          v-if="input.type === 'date'"
                          :label="input.label"
                          :label-for="input.label"
                      >   
                          <b-form-datepicker 
                              :id="input.label" 
                              v-model="input.value"
                          >
                          </b-form-datepicker>
                      </b-form-group>

                      <b-form-group
                          v-if="input.name === 'link' && input.name !== 'date'"
                          :label="input.label"
                          :label-for="input.label"
                          :description="input.description"
                      >
                          <b-form-input
                              v-model="input.value"
                              :id="input.label"
                              :value="input.value"
                              :type="input.type"
                              :placeholder="input.placeholder"
                              :required='input.required'
                              min="0"
                          ></b-form-input>
                      </b-form-group>
                  </div>
              </div>
          </div>
      </div>

      <div v-if="isLoaded" class="col-lg-12 card-wrapper">
          <div class="card">
              <div class="card-body">
                  <div class="row">
                      <div class="col-12 col-md-8 mb-3 mb-md-0 d-flex align-items-center">
                          <span>* Wajib Diisi</span>
                      </div>
                      <div class="col-12 col-md-4">
                          <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                              <b-button :disabled="isSubmit" variant="danger" @click="onResetCertainForm">Reset</b-button>
                              <b-button v-if="getSteps[0].key !== activeStep" type="back" :disabled="isSubmit" variant="warning" @click="$emit('previousStep')">Back</b-button>
                              <b-button v-if="getSteps[getSteps.length - 1].key == activeStep" type="submit" :disabled="isSubmit" variant="primary" @click="onSubmitForm">Submit</b-button>
                              <b-button v-else :disabled="isSubmit" type="submit" variant="primary" @click="nextStep">Lanjutkan</b-button>
                          </div>
                      </div>
                  </div>
                  
              </div>
          </div>
      </div>

      <b-modal id="modalLoading" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
          <div class="d-flex align-items-center justify-content-center">
              <b-spinner label="Spinning" class="mr-3"></b-spinner><span>Loading...</span>
          </div>
      </b-modal>

  </b-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Editor from '@tinymce/tinymce-vue'

import Dropzone from "@/components/Dropzone.vue";
import fieldForm from '@/store/global/course' 
import SearchSelect from '@/components/template/micro/inputs/SearchSelect.vue';
import SelectColor from "@/components/template/micro/inputs/SelectColor.vue";
import SearchDropdownCheckbox from '@/components/template/micro/inputs/SearchDropdownCheckbox.vue'
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue"

import { toDecrypt } from '~/commons/utils'

export default {
  props: {
    getSteps: {
      type: Array,
      default: []
    },
    activeStep: {
      type: String,
      default: '',
    },
    featureAction: {
      type: String,
      default: "",
    },
  },
  layout: 'dashboard',
  computed: {
      ...mapState({
          postState: (state) => state.Post,
          coursesState: (state) => state.Courses,
          servicesState: (state) => state.Services
      })
  },
  components: {
      Dropzone,
      Editor,
      SearchSelect,
      SelectColor,
      SearchDropdownCheckbox,
      DescriptionEditor
  },
  data() {
      return {
          title: '',
          programId: null,

          isSubmit: false,
          isLoaded: true,
          categoriesOptions: [],

          selectedCategory: null,
          selectedColor: "",
          selectedMateri: [],

          contentImage: null,

          onEvent: {
              message: '',
              status: true,
              show: false,
              variant: ''
          },

          inputFormBundleContent: [],
          inputFormBundleAttribute: [],
          inputFormListMateri: [],

          colorTemplate: fieldForm.colorTemplate,

          logo: null,
          imageCover: null,

          selectedAnnouncementType: '',
          optionMode: [
                { value: 'online', label: 'Online' }, 
                { value: 'offline', label: 'Offline'}, 
                { value: 'hybrid', label: 'Hybrid'}
            ],

          materiOptions: [],
          bundleSlug: null,
      }
  },
  filters: {
      capitalize: function (value) {
          if (!value) return ''
          value = value.toString()
          return value.charAt(0).toUpperCase() + value.slice(1)
      },
  },
  watch: {
    contentImage(newValue, oldValue){
        if(newValue) this.selectedColor = "";
        if(!newValue) this.selectedColor = this.colorTemplate[0].color;
    }
  },
  created() {
      this.initializationForm();
  },
  methods: {
      ...mapActions({
        getListCategory: "Courses/getListCategory",
      }),
      setEvent(message, status){
          window.scrollTo(0,0)
          this.onEvent.message = message
          this.onEvent.status = status
          this.onEvent.variant = status == true ? 'success' : 'warning'
          this.onEvent.show = true
      },
      resetEvent(){
        const defaultEvent = {
            message: '',
            status: true,
            show: false,
            variant: ''
        };
        this.onEvent = defaultEvent;
      },
      async initializationForm(){
        const url = this.$router.currentRoute.fullPath
        let res = url.split('/')
        res.shift()

        this.bundleSlug = this.$route?.params?.slug;

        if(this.featureAction == 'edit'){
          this.setInputForm();
          this.onResetForm();
          // await this.fetchListCategory();
          await this.fetchMateri();
          this.fetchBundleDetail();
        }else{
          this.setInputForm();
          this.onResetForm();
          this.setInputForm();
          // this.fetchListCategory();
          this.fetchMateri();
        }

      },
      // async fetchListCategory(){
      //     this.isLoaded = false;
      //     let categoriesOptions = [];

      //     await this.getListCategory();

      //     if(!this.coursesState.status){
      //       this.categoriesOptions = this.coursesState.categories
      //       this.isLoaded = true;
      //     }else{
      //       const categories = this.coursesState.categories ?? [];

      //       categories.map((item) => {
      //           const category = {
      //             value: item.id,
      //             label: item.name,
      //           }

      //           categoriesOptions.push(category);
      //       })
      //       this.categoriesOptions = categoriesOptions;
      //       this.isLoaded = true;
      //     }
      // },
      isCoverImageUrl(url) {
        if (url) {
          const imageExtensionRegex =
            /\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
          return imageExtensionRegex.test(url);
        }
      },
      async fetchBundleDetail(){
        this.isLoaded = false;

        await this.$store.dispatch("Courses/getDetailBundle", this.bundleSlug);

        if(!this.coursesState.status){
            console.error('Failed fetch classroom detail', this.servicesState.message)
            this.setEvent(this.coursesState.message, false)
            this.isLoaded = true
        }else{
            const bundleDetail = this.coursesState?.bundle;
            const isCoverImageUrl = this.isCoverImageUrl(bundleDetail?.cover);

            this.inputFormBundleContent.map((item) => {
                if(item.name === 'cover' && isCoverImageUrl){
                  item.value = bundleDetail?.cover;
                  this.contentImage = bundleDetail?.cover;
                  this.selectedColor = "";
                }
                if(item.name === "color" && !isCoverImageUrl){
                  // Set value of field cover image to be null
                  const findIndexImage = this.inputFormBundleContent.findIndex((item) => item.name === "cover");
                  this.inputFormBundleContent[findIndexImage].value = "";

                  const founded = this.colorTemplate.find(item => item.color == bundleDetail.cover);
                  this.contentImage = null;
                  if(founded) this.selectedColor = founded?.color;
                  else this.selectedColor = this.colorTemplate[0].color;
                }
                if(item.name === 'title'){
                    item.value = bundleDetail?.title;
                }
                if(item.name === 'description'){
                    item.value = bundleDetail?.description;
                }
            });

            this.inputFormBundleAttribute.map(item => {
                // if(item.name === 'category'){
                //     const categories = this.coursesState.categories ?? [];
                //     let category = {};

                //     categories.map((data) => {
                //         if(data.id == bundleDetail?.categoryId) category['value'] = data?.id, category['label'] = data?.name;
                //     })

                //     this.selectedCategory = category;
                // }
                if(item.name === 'price'){
                    item.value = bundleDetail?.price;
                }
            });

            if(bundleDetail?.moduleIds != null && bundleDetail?.moduleIds != []){
                bundleDetail?.moduleIds.map(id => {
                    const materiIndex = this.materiOptions.findIndex((modul) => modul.value === parseInt(id));
                    if (materiIndex != -1) this.materiOptions[materiIndex].checked = true
                })
            }

            this.isLoaded = true;
        }
      },
      async fetchMateri(){
          this.isLoaded = false
          let materiOptions = []

          await this.$store.dispatch('Services/getListModulesLibrary', {page: null, type: null})

          if(!this.servicesState.status) {
              console.error('Failed fetch modules', this.servicesState.message)
              this.setEvent(this.servicesState.message, false)
              this.isLoaded = true
          } else {
              const modules = this.servicesState.modules ?? []
              modules.map((item) => {
                  let object = {
                      value: item.id,
                      label: item.title,
                      checked: false,
                  }
                  materiOptions.push(object)
              })

              this.materiOptions = materiOptions
              this.isLoaded = true
          }
      },
      setInputForm(){
        this.inputFormBundleContent = fieldForm.inputFormBundleContent;
        this.inputFormBundleAttribute = fieldForm.inputFormBundleAttribute;
        this.inputFormListMateri = fieldForm.inputFormListMateri;

        // Set Color Default
        this.selectedColor = this.colorTemplate[0].color;

        // Set Default price to 0
        this.inputFormBundleAttribute.map(input => {
          if(input.name == "price"){
            input.value = 0;
          }
        });
      },
      nextStep(event){
        event.preventDefault();
        const isValidationPassed = this.validationField(1);
        if(isValidationPassed) this.resetEvent(), this.$emit('nextSteps','listMateri');
      },
      async onSubmitForm(event) {
          event.preventDefault()

          const isValidationPassed = this.validationField();

          if(isValidationPassed){
            this.isLoaded = false;
  
            let output = {}
  
            let inputForm = [];
            inputForm = inputForm.concat(this.inputFormBundleContent, this.inputFormBundleAttribute, this.inputFormListMateri);
  
            inputForm.forEach(item => {
                // if(item.name === 'category'){
                //   output.categoryId = this.selectedCategory.value;
                // }else 
                if(item.name === 'materi'){
                    let moduleids = [];
                    this.selectedMateri.map(item => {
                      moduleids.push(`${item.value}`);
                    });
                    output.moduleids = moduleids;
                }else if(item.name === "cover" || item.name === "color"){
                  output.cover = this.contentImage ? this.contentImage : this.selectedColor;
                }else if(item.name === "price"){
                  output[item.name] = parseInt(item.value);
                }else{
                  output[item.name] = item.value
                }
            })

            if(this.featureAction === "edit") {
              const payload = {
                slug: this.bundleSlug,
                params: output,
              }
              await this.$store.dispatch("Courses/editBundle", payload);
            }
            if(this.featureAction === "create") await this.$store.dispatch("Courses/createBundle", output);
  
            if(!this.coursesState.status){
              if(this.featureAction === "edit") console.error('Failed to Edit bundle', this.coursesState.message)
              if(this.featureAction === "create") console.error('Failed to Create bundle', this.coursesState.message)
              this.setEvent(this.coursesState.message, false)
              this.isLoaded = true
            }else{
              if(this.featureAction === "edit") this.setEvent("Edit Bundle successfully", true);
              if(this.featureAction === "create") this.setEvent("Create Bundle successfully", true);
              this.isLoaded = true;
              this.onResetForm();
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            }
          }

      },

      onResetForm(){
        this.inputFormBundleContent.forEach(item => {
          item.value = "";
        });

        this.inputFormBundleAttribute.forEach(item => {
          item.value = "";
        });

        this.inputFormListMateri.forEach(item => {
          item.value;
        })

        this.materiOptions.forEach(item => {
          item.checked = false;
        })

        this.selectedCategory = null;
        this.selectedColor = "";
        this.selectedMateri = [];
        this.contentImage = null;
      },
      onResetCertainForm(){
        if(this.activeStep === 'createBundle'){
          this.inputFormBundleContent.forEach(item => {
            item.value = "";
          });

          this.inputFormBundleAttribute.forEach(item => {
            item.value = "";
          });

          this.selectedCategory = null;
          this.selectedColor = "";
          this.contentImage = null;
        }else if(this.activeStep === 'listMateri'){
          this.inputFormListMateri.forEach(item => {
            item.value;
          })

          this.materiOptions.forEach(item => {
            item.checked = false;
          })

          this.selectedMateri = [];
        }
      },
      validationField(step){
        let isValidationPassed = true;
        let dataFieldStepOne = {};

        this.inputFormBundleContent.forEach(item => {
          dataFieldStepOne[item.name] = item.value;
        })

        this.inputFormBundleAttribute.forEach(item => {
          dataFieldStepOne[item.name] = item.value;
        })
        
        if(step == 1){
          if(dataFieldStepOne.title == ""){
            this.setEvent("Isikan judul Bundle terlebih dahulu", false)
            return !isValidationPassed;
          }
          // if(this.selectedCategory === null){
          //   this.setEvent("Pilih category terlebih dahulu", false)
          //   return !isValidationPassed;
          // }
          if(dataFieldStepOne.price === ""){
            this.setEvent("Isikan price terlebih dahulu", false)
            return !isValidationPassed;
          }
        }else{
          if(this.selectedMateri.length == 0){
            this.setEvent("Pilih materi terlebih dahulu")
            return !isValidationPassed;
          }
        }

        return isValidationPassed;
      }
  }
  
}
</script>

<style>

</style>