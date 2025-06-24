<template>
    <div>
        <b-row id="select-video-conference" align-v="stretch" class="mb-2">
            <b-col cols="12" md="4" v-for="(item, index) in items" :key="index" class="my-2">
                
                <b-card body-class="d-flex flex-column justify-content-center gap-2" class="card-item border rounded mb-0 h-100" @click="selectItem(item?.value)">
                    <div class="d-flex align-items-center gap-2 h-100">
                        <div class="flex-grow-1 d-flex align-items-center gap-2">
                            <img :src="item?.icon" :alt="`${ item?.label } Icon`" class="icon">
                            <div>
                                <h6 class="text-limit limit-1">{{ item?.label }}</h6>
                                <span class="text-limit limit-1">{{ item?.description }}</span>
                            </div>
                        </div>
                        <i v-if="!item?.selected" class="ri-checkbox-blank-circle-line mb-auto"></i>
                        <div v-else class="selected-checkbox mb-auto">
                            <i class="ri-checkbox-blank-circle-line"></i>
                            <i class="ri-checkbox-blank-circle-fill"></i>
                        </div>
                    </div>
                    <div v-if="item?.link" class="d-flex align-items-center gap-2">
                        <small class="text-limit limit-1 flex-grow-1">{{ item?.link }}</small>
                        <b-button v-b-tooltip.hover variant="no-styles" :title="tooltipText" class="btn-copy" @click="copyLink(item?.link)">
                            <i class="ri-file-copy-line fa-lg"></i>
                        </b-button>
                    </div>
                    <div v-if="!item?.configuration && !isConfiguration" class="d-flex align-items-center gap-2">
                        <small v-if="userKind === 'superadmin' || userKind === 'admin'" class="text-danger text-limit limit-1 flex-grow-1">Platform tidak tersambung. <small class="text-primary text-underline pointer" @click="directSettings">Atur konfigurasi</small> terlebih dahulu.</small>
                    </div>
                </b-card>

            </b-col>
        </b-row>
        <span v-if="!isConfiguration && (userKind === 'superadmin' || userKind === 'admin')">* Jika platform belum tersambung. Silahkan <span class="text-primary text-underline pointer" @click="directSettings">atur konfigurasi</span> terlebih dahulu.</span>
        <span v-if="selectedItem && isFromSettings">* Baca <span class="text-primary text-underline pointer" @click="openPdf">buku panduan</span> untuk menyambungkan <strong>Platform {{ selectedItem?.value === 'gmeet' ? 'Google Meet' : 'Zoom Meeting' }}</strong> ke LMS ini.</span>

        <b-modal v-model="isPlatformModal" hide-header hide-footer centered size="md">
            <b-form @submit.prevent="submitForm">
                <h5 class="mb-3">Custom Platform Video Conference</h5>

                <b-form-group
                    :label="`Platform *`"
                    :label-for="`input-platform`"
                >
                    <b-form-input id="input-platform" v-model="inputForm.place" type="text" required></b-form-input>
                </b-form-group>

                <b-form-group
                    :label="`Link *`"
                    :label-for="`input-link`"
                >
                    <b-form-input id="input-link" v-model="inputForm.content" type="url" required></b-form-input>
                </b-form-group>

                <div class="d-flex align-items-center justify-content-between mt-5">
                    <span>* Wajib Diisi</span>
                    <b-button type="submit" variant="primary">Submit</b-button>
                </div>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { TAB_MENU_FORM_SETTINGS } from "~/commons/constants/layouts";

export default {
    props: {
        value: {
            type: String,
            default: "",
        },
        link: {
            type: String,
            default: "",
        },
        isConfiguration: {
            type: Boolean,
            default: false,
        },
        isFromSettings: {
            type: Boolean,
            default: false,
        },
        hiddenItems: {
            type: Array,
            default: () => []
        },
        customInputForm: {
            type: Object,
            default: () => {
                return {
                    place: "",
                    content: ""
                }
            },
        },
    },

    data() {
        return {
            isPlatformModal: false,
            tooltipText: "Tekan untuk menyalin link",
            selectedItem: null,
            inputForm: this.customInputForm,
            gmeetTarget: "https://docs.google.com/document/d/1CA5YiKb4J0W6RrMCKMEnNlMdFdLATLMzH1rlFP3lT2s/edit?usp=sharing",
            zoomTarget: "https://docs.google.com/document/d/1BS7l6iWhqUKjcdMXSR6Xude8NaItrTkUDJSbVSTjkuc/edit?usp=sharing",
            items: []
        }
    },

    computed: {
        ...mapState({
            settings: (state) => state?.Sass?.settings,
            userKind: (state) => state.Auth?.user_kind,
        })
    },

    mounted() {
        this.setItems()
        this.setLink()
        this.selectItem(this.value, false)
        this.handleHiddenItems()
    },

    methods: {

        ...mapActions({
            setActiveTab: 'Layouts/setActiveTab',
            setTabs: "Layouts/getTabs",
        }),

        setItems() {
            this.items = [
                {
                    icon: "/dashboard/assets/image/gmeet.png",
                    label: "Google Meet",
                    description: "Otomatis Generate",
                    configuration: this.settings?.meetType === 'gmeet' ? true : false,
                    link: "",
                    value: "gmeet",
                    selected: false,
                },
                {
                    icon: "/dashboard/assets/image/zoom.png",
                    label: "Zoom Meeting",
                    description: "Otomatis Generate",
                    configuration: this.settings?.meetType === 'zoom' ? true : false,
                    link: "",
                    value: "zoom",
                    selected: false,
                },
                {
                    icon: "/dashboard/assets/image/computer.png",
                    label: "Manual",
                    description: "Inputkan Link Manual",
                    configuration: true,
                    link: "",
                    value: "manual",
                    selected: false,
                },
            ]
        },

        selectItem(value, onClick = true) {
            const foundIndex = this.items?.findIndex(data => data?.value === value)

            if (this.selectedItem) {
                if (this.selectedItem.value != this.items[foundIndex].value) {
                   this.setSelectedItem(foundIndex) 
                }
            } else this.setSelectedItem(foundIndex)

            if (this.selectedItem?.value === 'manual' && onClick) this.isPlatformModal = true
        },

        setSelectedItem(foundIndex) {
            this.items?.map((item, index) => {
                if (index === foundIndex) this.items[index].selected = true
                else this.items[index].selected = false
            })

            this.selectedItem = this.items[foundIndex]
            this.$emit('onChange', this.selectedItem?.value ?? null)
        },

        // Deprecated method copy text to clipboard
        tryUseDeprecatedMethod(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                
                if (successful) this.tooltipText = "Link Berhasil Disalin!"
                else this.tooltipText = "Gagal Menyalin Link!"

                setTimeout(() => {
                    this.tooltipText = "Tekan untuk menyalin link"
                }, 2000);
            } catch (e) {
                console.error('Gagal menyalin link menggunakan metode lama: ', e);
            }

            document.body.removeChild(textArea);
        },

        // Copy text to clipboard
        copyLink(value) {
            if (!navigator?.clipboard) {
                this.tryUseDeprecatedMethod(value);
                return;
            }
            navigator?.clipboard?.writeText(value).then(function() {
                this.tooltipText = "Link Berhasil Disalin!"

                setTimeout(() => {
                    this.tooltipText = "Tekan untuk menyalin link"
                }, 2000);
            }, function(e) {
                console.error('Gagal menyalin link: ', e);
            });
        },

        submitForm() {
            this.isPlatformModal = false
            this.$emit('onSubmitForm', this.inputForm)
        },

        setLink() {
            const findIndex = this.items?.findIndex(item => item.value === this.value)
            if (findIndex != -1) {
                this.items[findIndex].link = this.link
            }
        },

        directSettings() {
            this.setTabs(TAB_MENU_FORM_SETTINGS);
            this.setActiveTab('video')
            this.$router.push(`/dashboard/settings`)
        },

        openPdf() {
            if (this.selectedItem?.value === 'gmeet') window.open(this.gmeetTarget, '_blank')
            else if (this.selectedItem?.value === 'zoom') window.open(this.zoomTarget, '_blank')
        },

        handleHiddenItems() {
            // hidden by props value
            this.hiddenItems?.map(item => {
                const findIndex = this.items?.findIndex(data => data?.value === item)
                if (findIndex != -1) this.items?.splice(findIndex, 1)
            })

            // Hidden by configuration settings
            // if (this.settings?.meetType && !this.isFromSettings) {
            //     const hiddenItem = this.settings?.meetType === 'zoom' ? 'gmeet' : 'zoom'
            //     const findIndex = this.item?.findIndex(data => data?.value === hiddenItem)
            //     if (findIndex != -1) this.items?.splice(findIndex, 1)
            // }
        }

    }
}
</script>

<style lang="scss" scoped>
#select-video-conference {
    .card-item {
        cursor: pointer;

        .card-body {
            padding: 12px;
        }

        .icon {
            width: 34px;
            height: 34px;
            object-fit: contain;
        }
        
        h6 {
            font-size: 14px;
        }

        span {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
        }

        small {
            color: #000000;
            font-size: 10px;
        }

        .btn-copy {
            display: flex;
            padding: 8px 0;
            transform: none;
            box-shadow: none;
        }

        .selected-checkbox {
            position: relative;

            i {
                color: #2096C4;
                
                &:last-child {
                    top: 5px;
                    left: 4px;
                    position: absolute;
                    font-size: 8px;
                }
            }
        }
    }

    .form-group label {
        color: #000000;
        font-size: 14px;
    }
}
</style>