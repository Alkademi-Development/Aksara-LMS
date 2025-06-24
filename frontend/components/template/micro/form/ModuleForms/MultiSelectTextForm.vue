<template>
    <b-form-group
        :label="input.label"
        :label-for="input.label"
        :description="input.description"
    >
        <b-row class="multifile-forms-container d-flex flex-row align-items-center">
            <b-col>
                <div class="d-flex flex-row align-items-center border">
                    <button
                        class="type-button btn border-right mr-0"
                        role="button" 
                        data-toggle="dropdown" 
                        aria-haspopup="true" 
                        aria-expanded="false"
                    >
                        {{ !!selectedFileType ? selectedFileType?.label : 'Tipe' }}
                        <i class="ri-arrow-down-s-line ml-2"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-left mt-3" style="z-index: 99;">
                        <div 
                            class="dropdown-item"
                            v-for="(type, idx) in fileType"
                            :key="idx"
                            @click="onClickFileType(type)"
                        >
                            {{ type?.label }}
                        </div>
                    </div>
                    <b-form-input
                        class="multifile-input"
                        v-model="inputFile"
                        :id="input.label"
                        :value="inputFile"
                        :type="input.type"
                        :placeholder="input.placeholder"
                        min="0"
                    ></b-form-input>
                </div>
            </b-col>
            <b-col cols="auto">
                <div class="add-file-button btn btn-primary" @click="onSaveFileType()">Simpan</div>
            </b-col>
        </b-row>

        <div class="multifile-value-container">
            <div
                v-for="(file, idx) in attachments" 
                :key="idx"
                :class="['multifile-item d-flex flex-row align-items-center border', attachments?.length > 0 ? 'mb-2' : '']"
            >
                <span class="type">{{ file?.kind }}</span>
                <span class="link">{{ file?.file }}</span>
                <span class="remove-icon-container" @click="onRemoveFileType(idx)">
                    <i class="ri-close-line"></i>
                </span>
            </div>
        </div>
    </b-form-group>
</template>

<script>
export default {
    props: {
        input: {
            type: Object,
            default: () => {},
            required: true
        },
        attachments: {
            type: Array,
            default: () => [],
            required: false
        }
    },
    data() {
        return {
            isBusy: false,
            
            fileType: [
                {
                    key: 'document',
                    label: 'Dokumen'
                },
                {
                    key: 'slide',
                    label: 'Slide'
                },
                {
                    key: 'video',
                    label: 'Video'
                },
                {
                    key: 'image',
                    label: 'Gambar'
                },
                {
                    key: 'sound',
                    label: 'Suara'
                }
            ],
            selectedFileType: null,

            inputFile: '',

            tempAttachments: [],
            errorMessage: ''

        }
    },
    watch: {
        tempAttachments() {
            this.$emit('onUpdateAttachments', this.tempAttachments)
        }
    },
    created() {
        if (this.attachments?.length > 0) {
            this.tempAttachments = this.attachments
        }
    },
    methods: {
        onRemoveFileType(idx) {
            this.tempAttachments?.splice(idx, 1)
        },
        onClickFileType(type) {
            if (!!type) {
                this.selectedFileType = type
            }
        },
        onSaveFileType() {
            this.isBusy = true

            if (!!this.selectedFileType && this.inputFile?.trim()?.length > 0) {
                const type = {
                    kind: this.selectedFileType?.key,
                    file: this.inputFile
                }
    
                this.tempAttachments.push(type)
                this.clearForms()
            }else {
                this.errorMessage = 'Isi inputan dengan benar'
            }

            this.isBusy = false
        },
        clearForms() {
            this.selectedFileType = null
            this.inputFile = ''
        }
    }
}
</script>

<style lang="scss" src="@/assets/scss/components/micro/forms/module-forms.scss"></style>