<template>
    <b-card no-body class="overflow-hidden">
        <b-card-body>
            <b-row no-gutters align-v="center">
                <b-col cols="12" md="6" lg="8" class="d-flex align-items-center">
                    <div @click="backHandler()" v-if="path == 'inProgram'" class="d-inline-block btn mr-3 icon icon-shape bg-dark text-white rounded-circle shadow">
                        <i class="ni ni-bold-left"></i>
                    </div>
                    <b-card-title class="mb-0">{{ batch.name }}{{ batch.programId ? program.name ? ` - ${program.name}` : '' : ''}}</b-card-title>
                </b-col>
                <!-- <b-col>
                    <b-card-text>
                        <row class="programs"  v-for="(cities, index) in batch.cities" :key="index">
                            {{cities.name}}{{index != batch.cities.length - 1 ? ',&nbsp;' : ''}}
                        </row>
                    </b-card-text>
                </b-col> -->
                <b-col cols="12" md="3" lg="2" class="mb-4 mt-md-0 mb-md-0">
                    <div class="text-md-right" v-if="path != 'inProgram'">
                        <div v-if="isActive" class="badge badge-pill badge-success">Tahap Pendaftaran</div>
                        <div v-else :class="`badge badge-pill badge-${ batch.status == 1 ? 'success' : batch.status == 0 ? 'primary' : 'danger' }`">{{ batch.status == 1 ? 'Tahap Pendaftaran' : batch.status == 2 ? 'Tidak Tersedia di Kota Anda' : 'Telah berakhir' }}</div>
                    </div>
                </b-col>
                <b-col cols="12" md="3" lg="2"  class="mt-md-0">
                    <div class="text-md-right" v-if="path != 'inProgram'">
                        <b-button 
                            v-if="isActive"
                            pill 
                            variant="success" 
                            style="color: white"
                            @click="onClickBatch(batch, isActive)">
                            {{ registrationStatus == 'fillPretest' ? 'Mulai Pretest' : 'Pilih Program' }}
                        </b-button>
                        <b-button 
                            v-else
                            pill 
                            :variant="batch.status == 1 ? 'success' : 'primary'" 
                            style="color: white"
                            @click="onClickBatch(batch.id, batch.status)">
                            {{ batch.status == 1 ? 'Pilih Program' : 'Lihat Detail'}}
                        </b-button>
                    </div>
                    <div class="text-md-right" v-else>
                        <div v-if="isActive" class="badge badge-pill badge-success">Tahap Pendaftaran</div>
                        <div v-else :class="`badge badge-pill badge-${ batch.status == 1 ? 'success' : batch.status == 0 ? 'primary' : 'danger' }`">{{ batch.status == 1 ? 'Tahap Pendaftaran' : batch.status == 2 ? 'Tidak Tersedia di Kota Anda' : 'Telah berakhir' }}</div>
                    </div>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    props: {
        batch: {
            type: Object
        },
        isActive: Boolean,
        path: String,
        registrationStatus: String,
    },

    data() {
        return {
            program: {},
        }
    },

    created() {
        this.fetchPrograms()
    },

    methods: {
        backHandler() {
            this.$emit('onBackClicked')
        },
        onClickBatch(batch, status) {
            if (status == 1 || status == true) {
                if (this.registrationStatus == 'fillPretest') {
                    this.$emit('onStartPretest')
                } else {
                    this.$emit('onClickBatch', batch)
                }
            }
        },

        async fetchPrograms(){
            
            await this.$store.dispatch('Programs/getProgramById', this.batch.programId)
            .then(() => {
                var statePrograms = this.$store.state.Programs

                if(!statePrograms.status) {

                    console.error('Failed fetch programs', statePrograms.message)

                } else {

                    this.program = statePrograms.programs

                }
            })

        },
    }
}
</script>