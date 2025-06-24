<template>
  <div>
    <div class="card" @click="onClickDetail">
      <div class="wrapper-content">
        <div class="wrapper-header" :style="{'background-color': !isCoverImage ? data?.cover || '#FFE1CC' : ''}">
          <template v-if="isCoverImage">
            <b-img-lazy
              :src="data?.cover"
              :alt="`cover-${data?.title}`"
              class="w-100 h-100" style="object-fit: cover"
              fluid
              blank-color="#D9D9D9"
            />
            <!-- <img v-if="isCoverImage" :src="data?.cover" :alt="`cover-${data?.title}`" class="w-100 h-100" style="object-fit: cover"> -->
          </template>
          <div v-if="data?.owned && getActiveTab === 'library'" class="position-absolute bg-white d-flex justify-content-center align-items-center rounded-circle" style="top: 10px; right: 10px; width: 24px; height: 24px">
            <i class="ri-checkbox-circle-fill" style="font-size: 20px;"></i>
          </div>
        </div>
        <div class="wrapper-body">
          <div :class="`d-flex flex-column gap-3 ${data?.category ? 'pt-2' : 'pt-3'}`">
            <div v-if="data?.category" class="d-flex justify-content-between align-items-center">
              <div class="category-bundle">{{ data.category }}</div>
            </div>
            <h5 class="title-bundle cursor-pointer text-limit limit-1">{{ data.title }}</h5>
            <p v-html="data.description" class="text-limit limit-4 description-bundle overflow-hidden"></p>
          </div>
          <div class="d-flex justify-content-between align-items-center pb-1">
            <div class="d-flex align-items-center materi-bundle">
              <i class="ri-book-open-line"></i>
              <p class="mb-0">{{ data?.modules && data?.modules?.length > 0 ? data?.modules?.length : 0 }} Materi</p>
            </div>
            <div v-if="data?.price == 0" class="price">
              <p class="mb-0">{{ data?.price == 0 ? 'Free' : formatCurrencyRupiah(data?.price) }}</p>
            </div>
          </div>
          <template v-if="userRole === 'superadmin'">
            <b-dropdown no-caret variant="transparent" right size="sm" toggle-class="p-0" class="more-menu border rounded d-flex justify-content-center align-items-center position-absolute">
              <template #button-content>
                  <i class="ri-more-line"></i>
              </template>
              <b-dropdown-item @click="handleEdit">
                  <i class="ri-edit-line"></i><span>Edit</span>
              </b-dropdown-item>
              <b-dropdown-item @click="deleteBundle">
                  <i class="ri-delete-bin-7-line text-danger"></i><span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </div>
      </div>
    </div>
    <!-- <div class="card card-solid overflow-hidden position-relative cursor-pointer" @click="onClickDetail">
      <div class="wrapper-bundle" style="gap: 15px">
        <div class="wrapper-solid position-relative" :style="{'background-color': data.cover ? data?.cover : '#FFE1CC'}">
          <div v-if="data?.owned && getActiveTab === 'library'" class="position-absolute bg-white d-flex justify-content-center align-items-center rounded-circle" style="top: 10px; right: 10px; width: 30px; height: 30px">
            <i class="ri-checkbox-circle-fill" style="font-size: 27px;"></i>
          </div>
        </div>
        <div class="wrapper-content h-100 d-flex flex-column justify-content-between position-relative">
          <div class="pt-1">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div v-if="data?.category" class="category-bundle">{{ data.category }}</div>
            </div>
            <h3 class="mb-2 title-bundle cursor-pointer">{{ data.title }}</h3>
            <p v-html="data.description" class="text-limit limit-4 description-bundle"></p>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center materi-bundle">
              <i class="ri-book-open-line"></i>
              <p class="mb-0">{{ data?.modules && data?.modules?.length > 0 ? data?.modules?.length : 0 }} Materi</p>
            </div>
            <div v-if="data?.price == 0" class="price">
              <p>{{ data?.price == 0 ? 'Free' : formatCurrencyRupiah(data?.price) }}</p>
            </div>
          </div>
          <template v-if="userRole === 'superadmin'">
            <b-dropdown no-caret variant="transparent" right size="sm" toggle-class="p-0" class="more-menu border rounded d-flex justify-content-center align-items-center position-absolute">
              <template #button-content>
                  <i class="ri-more-line"></i>
              </template>
              <b-dropdown-item @click="handleEdit">
                  <i class="ri-edit-line"></i><span>Edit</span>
              </b-dropdown-item>
              <b-dropdown-item @click="deleteBundle">
                  <i class="ri-delete-bin-7-line text-danger"></i><span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </div>
      </div>
    </div> -->
    <!-- <div v-if="data.isImage" class="card overflow-hidden position-relative cursor-pointer" @click="onClickDetail">
      <img :src="data?.cover" class="img-cover w-100 h-100 position-absolute"/>
      <div class="glass w-100 h-100 position-absolute d-flex overflow-hidden">
        <div class="wrapper-img position-relative h-100 overflow-hidden">
          <img :src="data?.cover" alt="" class="w-100 h-100">
          <div v-if="data?.owned && getActiveTab === 'library'" class="position-absolute bg-white d-flex justify-content-center align-items-center rounded-circle" style="top: 10px; right: 10px; width: 30px; height: 30px">
            <i class="ri-checkbox-circle-fill" style="font-size: 27px;"></i>
          </div>
        </div>
        <div class="wrapper-content h-100 d-flex flex-column justify-content-between position-relative">
          <div class="pt-1">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div v-if="data?.category" class="category-bundle">{{ data.category }}</div>
            </div>
            <h3 class="mb-2 title-bundle cursor-pointer">{{ data.title }}</h3>
            <p v-html="data.description" class="text-limit limit-4 description-bundle"></p>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center materi-bundle">
              <i class="ri-book-open-line text-dark"></i>
              <p class="mb-0">{{ data?.modules && data?.modules?.length > 0 ? data?.modules?.length : 0 }} Materi</p>
            </div>
            <div v-if="data?.price == 0" class="price">
              <p>{{ data?.price == 0 ? 'Free' : formatCurrencyRupiah(data?.price) }}</p>
            </div>
          </div>
          <template v-if="userRole === 'superadmin'">
            <b-dropdown no-caret variant="transparent" right size="sm" toggle-class="p-0" class="more-menu border rounded d-flex justify-content-center align-items-center position-absolute border-dark">
              <template #button-content>
                  <i class="ri-more-line text-dark"></i>
              </template>
              <b-dropdown-item @click="$emit('onEdit', data)">
                  <i class="ri-edit-line"></i><span>Edit</span>
              </b-dropdown-item>
              <b-dropdown-item @click="deleteBundle">
                  <i class="ri-delete-bin-7-line text-danger"></i><span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="card card-solid overflow-hidden position-relative cursor-pointer" @click="onClickDetail">
      <div class="d-flex align-items-center h-100 w-100" style="gap: 15px">
        <div class="wrapper-solid position-relative" :style="{'background-color': data.cover ? data?.cover : '#FFE1CC'}">
          <div v-if="data?.owned && getActiveTab === 'library'" class="position-absolute bg-white d-flex justify-content-center align-items-center rounded-circle" style="top: 10px; right: 10px; width: 30px; height: 30px">
            <i class="ri-checkbox-circle-fill" style="font-size: 27px;"></i>
          </div>
        </div>
        <div class="wrapper-content h-100 d-flex flex-column justify-content-between position-relative">
          <div class="pt-1">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div v-if="data?.category" class="category-bundle">{{ data.category }}</div>
            </div>
            <h3 class="mb-2 title-bundle cursor-pointer">{{ data.title }}</h3>
            <p v-html="data.description" class="text-limit limit-4 description-bundle"></p>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center materi-bundle">
              <i class="ri-book-open-line"></i>
              <p class="mb-0">{{ data?.modules && data?.modules?.length > 0 ? data?.modules?.length : 0 }} Materi</p>
            </div>
            <div v-if="data?.price == 0" class="price">
              <p>{{ data?.price == 0 ? 'Free' : formatCurrencyRupiah(data?.price) }}</p>
            </div>
          </div>
          <template v-if="userRole === 'superadmin'">
            <b-dropdown no-caret variant="transparent" right size="sm" toggle-class="p-0" class="more-menu border rounded d-flex justify-content-center align-items-center position-absolute">
              <template #button-content>
                  <i class="ri-more-line"></i>
              </template>
              <b-dropdown-item @click="handleEdit">
                  <i class="ri-edit-line"></i><span>Edit</span>
              </b-dropdown-item>
              <b-dropdown-item @click="deleteBundle">
                  <i class="ri-delete-bin-7-line text-danger"></i><span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  computed: {
      ...mapState({
          getActiveTab: (state) => state?.Layouts?.activeTab
      }),
      isCoverImage(){
        return this.data.isImage || this.data?.cover?.startsWith('http');
      }
  },
  data(){
    return{
      userRole: localStorage.getItem("user_kind"),
    }
  },
  methods:{
    edit(){
      this.$emit("onEdit", this.data);
    },
    deleteBundle(event){
      event.stopPropagation();
      this.$emit("onDelete", this.data);
    },
    formatCurrencyRupiah(price){
      let formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(price);
    
      // Menghapus dua digit nol di belakang jika ada
      // Rp 300.000,00 -> Rp 300.000
      formattedPrice = formattedPrice.split(",")[0];
      return formattedPrice;
    },
    onClickDetail() {
      if(this.data?.slug){
        this.$router.push(this.getActiveTab == 'library' ? `/dashboard/courses/bundle/${this.data?.slug}` : `/dashboard/courses/my-courses/bundle/${this.data?.slug}`);
      }
    },
    handleEdit(event){
      event.stopPropagation();
      this.$emit('onEdit', this.data);
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/components/courses/cardBundle.scss';
</style>