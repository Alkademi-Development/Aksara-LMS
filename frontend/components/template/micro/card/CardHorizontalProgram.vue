<template>
    <b-col cols="12" md="6" lg="4">
        <b-card no-body class="overflow-hidden">
            <b-card-body>
                <b-row no-gutters align-v="center">
                    <b-col md="12" class="mb-3">
                        <b-img v-if="program.logo" center :src="program.logo" alt="Left image" width="140"></b-img>
                    </b-col>
                    <b-col md="12" class="mb-1">
                        <div class="text-center">
                            <b-card-title class="mb-0">{{ program.name }}</b-card-title>
                        </div>
                    </b-col>
                    <b-col md="12" class="mb-3">
                        <b-card-text class="text-center">
                            {{ program.summary }}
                        </b-card-text>
                    </b-col>
                    <!-- <b-col md="6">
                        <div class="text-left">
                            <div :class="`badge badge-pill badge-${ program.status == 1 ? 'success' : 'danger' }`">{{ program.status == 1 ? 'Tersedia' : 'Kuota Habis' }}</div>
                        </div>
                    </b-col> -->
                    <b-col md="12">
                        <div class="text-center">
                            <b-button 
                                v-if="program.onRegistration == 1 && program.available == 1"
                                pill 
                                variant="success"
                                style="color: white"
                                @click="showConfirmModal">
                                Pilih Program
                            </b-button>
                            <b-button
                                v-if="program.onRegistration == 1 && program.available == 0" 
                                pill 
                                variant="success"
                                style="color: white"
                                disabled>
                                Pendaftaran Ditutup
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-card-body>
        </b-card>
    </b-col>
</template>

<script>
export default {
    props: {
        program: {
            type: Object,
        }
    },
    data() {
        return {
            confirmModal: ''
        }
    },
    methods: {
        showConfirmModal() {
            this.confirmModal = ''
            this.$bvModal.msgBoxConfirm('Tidak dapat merubah program kembali jika sudah memilih program.', {
                title: 'Konfirmasi Program',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: 'YA, LANJUTKAN',
                cancelTitle: 'TIDAK, PILIH ULANG',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
            .then(value => {
                this.confirmModal = value
                if (value){
                    this.$emit('onSubmitProgram', this.program.id)
                }
            })
            .catch(err => {
                // An error occurred
                console.error("Failed to Submit Program", err);
            })
        }
    }
}
</script>