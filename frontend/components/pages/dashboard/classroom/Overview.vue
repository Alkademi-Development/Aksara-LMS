<template>
    <div>
        <div class="row row-gap-3">
            <div class="col-12 col-xl-8">
                <div class="bg-white border w-100 rounded py-5 px-4">
                    <img src="https://drive.alkademi.id/v1/upload/class/1746627809445.png" alt="Logo" class="img-contain" style="max-height: 145px;">
                </div>
                <h5 class="my-4 fw-medium">Tentang</h5>
                <div class="row row-gap-3">
                    <div class="col-12 col-md-6">
                        <CardBoardInformation title="Pendaftaran" content="07 May 09:30 PM - 15 May 2025 12:10 PM" boardType="border-success" />
                    </div>
                    <div class="col-12 col-md-6">
                        <CardBoardInformation title="Pelaksanaan" content="15 May 12:00 PM - 15 May 2025 02:00 PM" boardType="border-info" />
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap gap-3 mt-4">
                    <div class="bg-white border rounded py-3 px-5 rounded w-100">
                        <h6>Pendaftaran Dibuka Untuk</h6>
                        <ul>
                            <li>
                                <span class="badge bg-secondary rounded-pill fw-normal text-black text-vsm mt-3 max-w-max">Semua Kota</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-white border rounded py-3 px-5 rounded w-100">
                        <h6>Dilaksanakan di</h6>
                        <ul>
                            <li>
                                <span class="badge bg-secondary rounded-pill fw-normal text-black text-vsm mt-3 max-w-max">Semua Kota</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="border rounded py-4 px-5 w-100 mt-4 ">
                    <p class="text-md">
                        Coding Your Way to Global Opportunities invites us to explore how programming skills can open doors to international career paths. This session dives deep into strategies for conquering coding assessments, shared by a competitive programming enthusiast who now works at one of the world’s leading tech companies.
    
                        This is an online event, open to the public, providing a valuable opportunity to learn directly from I Gede Arya Raditya P (Software Development Engineer @ Amazon UK), who will share effective tips and insights on mastering coding challenges.
    
    
                        NB: (Dapatkan Link Google Meet di Menu "Kegiatan")
                    </p>
                </div>
            </div>
            <div class="col-12 col-xl-4">
                <div class="bg-white border rounded p-4 w-100 mb-4">
                    <h3 class="fw-medium">Rp 20.0000</h3>
                    <button type="button" class="btn btn-primary mt-4 py-3 w-100">Daftar Sekarang</button>
                </div>
                <button type="button" class="btn btn-outline-primary py-3 mb-4 w-100">Pendaftaran Ditutup</button>
                <div class="bg-white border rounded py-4 px-5 w-100 mb-4">
                    <h5 class="fw-medium">Gabung grup diskusi</h5>
                    <button type="button" class="d-flex align-items-center gap-2 mt-2 text-base" @click.prevent="addLinkGroup = !addLinkGroup" v-if="!addLinkGroup">
                        <span class="text-primary fw-medium">Tambahkan Link Grup</span>
                        <i class="ri-pencil-line text-md"></i>
                    </button>
                    <div ref="inputWrapperLinkRef" class="mt-3" v-else>
                        <FormInput
                            v-model="formLinkGroup.link"
                            type="link"
                            placeholder="Tambahkan Link Grup..."
                        />
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between bg-white border rounded py-4 px-5 mb-4 w-100">
                    <h5 class="fw-medium">Mentor</h5>
                    <button type="button" class="btn btn-outline-primary d-flex align-items-center gap-2 mt-2 px-2 py-1 rounded text-sm text-primary" @click="showModalParticipantSelection = !showModalParticipantSelection;">
                        <i class="ri-add-line text-md"></i>
                        <span class="fw-medium">Tambahkan Mentor</span>
                    </button>
                </div>
                <div class="border rounded py-3 px-5 rounded w-100">
                    <h5 class="fw-medium">Prasyarat Kelas</h5>
                    <ul>
                        <li>
                            <span class="badge bg-secondary rounded-pill fw-normal text-black text-vsm mt-3 max-w-max">Kelas Utama</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-between w-100 mt-6">
            <p>* Wajib Diisi</p>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-warning-secondary px-4 py-2" @click="$emit('back')">Kembali</button>
                <button type="button" class="btn btn-disable px-4 py-2" @click="submitForm">Simpan Sebagai Draft</button>
                <button type="button" class="btn btn-primary px-4 py-2" @click="submitForm">Lanjutkan</button>
            </div>
        </div>
    </div>
    <ModalParticipantSelection 
        v-model="showModalParticipantSelection"
        title="Pilih Mentor"
        :options="mentorOptions"
        v-model:selected="selectedMentors"
        placeholder="Cari Nama atau Email Mentor..."
        label="Daftar Mentor"
        @close="showModalParticipantSelection = false;"
    />
</template>

<script setup>
import CardBoardInformation from "@/components/cards/CardBoardInformation.vue";
import FormInput from "~/components/ui/forms/FormInput.vue";
import ModalParticipantSelection from "~/components/ui/modals/ModalParticipantSelection.vue";

const formLinkGroup = ref({
    link: ''
})

const addLinkGroup = ref(false);
const inputWrapperLinkRef = ref(null);
const mentorOptions = ref([
  { value: "1", label: "Adnan Erlansyah" },
  { value: "2", label: "Budi Santoso" },
  { value: "3", label: "Citra Lestari" }
])
const showModalParticipantSelection = ref(false);
const selectedMentors = ref([]);


function handleClickOutside(event) {
  if (
    addLinkGroup.value &&
    inputWrapperLinkRef.value &&
    !inputWrapperLinkRef.value.contains(event.target)
  ) {
    addLinkGroup.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

</script>

<style lang="scss" scoped>

</style>