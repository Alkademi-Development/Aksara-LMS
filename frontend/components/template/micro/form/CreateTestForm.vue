<template>
    <b-row>
        <b-col v-if="pageShow == 'empty'" cols="12" class="d-flex flex-column align-items-center justify-content-center py-8">
            <p class="text-center mb-4">
                <b>Lewati proses ini jika kelas tidak membutuhkan Pre-Test / Post-Test</b>
            </p>
            <div class="w-100 d-flex justify-content-center">
                <b-button type="button" variant="primary" class="d-flex align-items-center gap-1 pl-3">
                    <i class="ri-add-line" style="font-size: 18px"></i>
                    PILIH SOAL
                </b-button>
                <b-button type="button" variant="primary" class="d-flex align-items-center gap-1 pl-3" @click="onChangePage('create-test')">
                    <i class="ri-add-line" style="font-size: 18px"></i>
                    TAMBAH BARU
                </b-button>
            </div>
        </b-col>

        <b-col v-if="pageShow == 'create-test'" cols="12">
            <b-form>
                <b-card no-body>
                    <div class="card-body">
                        <h4 class="mb-4">Buat Tes</h4>

                        <b-row>
                            <b-col cols="12" md="8">
                                <b-row>
                                    <template v-for="(input, idx) in inputForm">
                                        <template v-if="input.name != 'testKind' && input.name != 'deadline'">
                                            <b-col :key="idx" cols="12">
                                                <b-form-group
                                                    v-if="input.name == 'testType'"
                                                    :label="input.label"
                                                    :label-for="input.label"
                                                    :description="input.description"
                                                >
                                                    <SelectTestType />
                                                </b-form-group>
                                                <b-form-group
                                                    v-else-if="input.name == 'description'"
                                                    ref="classDesc"
                                                    :label="input.label"
                                                    :label-for="input.label"
                                                    :description="input.description"
                                                >
                                                    <text-markdown
                                                        :value="input.value"
                                                        :placeholder="input.placeholder"
                                                        @onChange="input.value = $event"/>
                                                </b-form-group>
                                                <b-form-group
                                                    v-else
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
                                                        :required="input.required"
                                                        :disabled="input.disabled"
                                                    ></b-form-input>
                                                </b-form-group>
                                            </b-col>
                                        </template>
                                    </template>
                                </b-row>
                            </b-col>
                            <b-col cols="12" md="4">
                                <b-row>
                                    <template v-for="(input, idx) in inputForm">
                                        <template v-if="input.name == 'testKind' || input.name == 'deadline'">
                                            <b-col :key="idx" cols="12">
                                                <b-form-group
                                                    v-if="input.name == 'testKind'"
                                                    :label="input.label"
                                                    :aria-label="input.label"
                                                    :description="input.description"
                                                >
                                                    <b-form-select
                                                        v-model="selectedType"
                                                        :id="input.label"
                                                        :value="selectedType"
                                                        :options="optionType"
                                                        :required="input.required"
                                                    ></b-form-select>

                                                    <b-button
                                                        v-if="selectedType == 'form' || selectedType == 'studio'"
                                                        type="button"
                                                        variant="primary"
                                                        block class="mt-2"
                                                    >
                                                        Pilih {{ selectedType == 'form' ? 'Form' : 'Editor' }}
                                                    </b-button>
                                                </b-form-group>
                                                <b-form-group
                                                    v-else
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
                                                        :required="input.required"
                                                        :disabled="input.disabled"
                                                    ></b-form-input>
                                                </b-form-group>
                                            </b-col>
                                        </template>
                                    </template>
                                </b-row>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>

                <b-row>
                    <b-col cols="12">
                        <b-card no-body>
                            <div class="card-body">
                                <b-row>
                                    <b-col cols="12">
                                        <div class="d-flex flex-wrap justify-content-left justify-content-md-end box-button">
                                            <b-button type="button" variant="danger">Reset</b-button>
                                            <b-button type="button" variant="secondary" @click="onChangePage('empty')">Kembali</b-button>
                                            <b-button type="button" variant="primary">Lanjutkan</b-button>
                                        </div>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-card>
                    </b-col>
                </b-row>
            </b-form>
        </b-col>

        <!-- <b-col>
            <div class="d-flex justify-content-between align-items-center">
                <h5>Daftar Tes</h5>
                <b-button type="button" variant="primary">TAMBAH</b-button>
            </div>
        </b-col> -->

        <b-col v-if="pageShow != 'create-test'" cols="12">
            <b-card no-body>
                <div class="card-body">
                    <b-row>
                        <b-col cols="12">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end box-button">
                                <b-button type="button" variant="secondary" @click="$emit('changeStep', 'class')">Kembali</b-button>
                                <b-button type="button" variant="primary" @click="$emit('changeStep', 'course')">Lanjutkan</b-button>
                            </div>
                        </b-col>
                    </b-row>
                </div>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import SelectTestType from '../inputs/SelectTestType.vue'
import inputField from '~/store/global/createClassroom'

export default {
    components: { SelectTestType },
    data() {
        return {
            inputForm: [],
            selectedType: 'disabled',
            optionType: [
                { value: 'disabled', text: 'Pilih salah satu', disabled: true },
                { value: 'link', text: 'Link'},
                { value: 'file', text: 'File'},
                { value: 'form', text: 'Formulir'},
                { value: 'studio', text: 'Editor'}
            ],
            // empty | create-test | list
            pageShow: 'empty'
        }
    },
    created() {
        this.initializeForm()
    },
    watch: {},
    methods: {
        initializeForm() {
            this.inputForm = [...inputField.inputFormTest]
        },
        onChangePage(page = 'empty') {
            this.pageShow = page
        }
    }
}
</script>
