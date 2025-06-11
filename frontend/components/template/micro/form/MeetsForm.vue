<template>
    <div :class="customClass" >
        <div :class="isCard ? 'card' : ''">
            <div v-if="!hideHeader" :class="isCard ? 'card-header' : ''">
                <div class="row">
                    <div class="col-6 d-flex align-items-center">
                        <CircleBackButton class="d-inline-block" />
                        <h3 class="d-inline-block mb-0">{{ title | capitalize }}</h3>
                    </div>
                </div>
            </div>
            <div :class="isCard ? 'card-body' : ''" v-if="isLoaded">
                <b-alert 
                    v-model="onEvent.show"
                    :variant="onEvent.variant"
                    dismissible
                >
                    {{ onEvent.message }}
                </b-alert>
                <b-form @submit="onSubmitForm">
                    <b-row>
                        <!-- <b-col 
                            v-for="(input, index) in inputForm" 
                            :key="index" 
                            cols="12" 
                            :md="input.name === 'place' ? 6 : input.name === 'link' ? 6 : 12"
                            class="align-self-end"
                        > -->
                        <b-col 
                            v-for="(input, index) in inputForm" 
                            :key="index" 
                            cols="12" 
                            class="align-self-end"
                        >
                            <b-form-group
                                v-if="input.type != 'select' && input.type != 'textarea' && input.name !== 'place' && input.name !== 'address' && input.name !== 'link' && input.name != 'latitude' && input.name != 'longitude' && input.name != 'radius' && input.name != 'openTime' && input.name != 'closeTime' && input.name != 'addAttendance' && input.name != 'content'"
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
                                    max="100"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group
                                v-if="selectedType === 'offline' && (input.name === 'place' || input.name === 'address' || input.name === 'link' || input.name === 'content')"
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
                                    :required="selectedType === 'offline' ? input.required : false"
                                    min="0"
                                    max="100"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group
                                v-if="input.name == 'type'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description" 
                            >
                                <b-form-select
                                    v-model="selectedType"
                                    :id="input.label"
                                    :value="input.value"
                                    :options="input.options"
                                    :required='input.required'
                                ></b-form-select>
                            </b-form-group>

                            <b-form-group
                                v-if="input.type == 'textarea'"
                                :label="input.label"
                                :label-for="input.label"
                                :description="input.description"
                            >
                                <b-form-textarea
                                    v-model="input.value"
                                    :id="input.label"
                                    :value.sync="input.value"
                                    :type="input.type"
                                    :placeholder="input.placeholder"
                                    :required='input.required'
                                ></b-form-textarea>
                            </b-form-group>
                            
                            <!-- <b-form-group
                                v-if="selectedType === 'online' && input.name === 'topicIds'"
                                :label="input?.label"
                                :label-for="`checkbox-${input?.name}`"
                            >
                                <SearchDropdownCheckbox 
                                    :id="`checkbox-${input?.name}`"
                                    class="w-100"
                                    buttonTitle="Pilih topik"
                                    :description="input?.description"
                                    :placeholder="input?.placeholder"
                                    :items="listCourse"
                                    @onChange="selectedCourse = $event"
                                />
                            </b-form-group> -->

                            <b-form-group
                                v-if="selectedType === 'online' && input.name === 'meets'"
                                :label="input?.label"
                                :label-for="`checkbox-${input?.name}`"
                            >
                                <SelectVideoConference
                                    :value="selectedPlatform"
                                    :link="selectedPlatformLink"
                                    :customInputForm="customInputPlatform"
                                    @onChange="selectedPlatform = $event"
                                    @onSubmitForm="onSubmitCustomPlatform"
                                />

                            </b-form-group>

                            <b-form-checkbox
                                v-if="input.name === 'addAttendance'"
                                v-model="isAttendance"
                                class="mb-2"
                                :value="true"
                                :unchecked-value="false"
                            >Absensi</b-form-checkbox>

                            <template v-if="selectedType === 'offline'">
                                <template v-if="isAttendance">
                                    <b-form-group
                                        v-if="input.name === 'latitude'"
                                        :description="input.description"
                                    >
                                        <MapsAttendance
                                            :tempLat="detailAttendance?.latitude"
                                            :tempLng="detailAttendance?.longitude"
                                            @onMapsClick="onMapsClick"
                                        />
                                    </b-form-group>

                                    <b-form-group
                                        v-if="input.name === 'radius'"
                                        :label="input.label"
                                        :label-for="input.label"
                                        :description="input.description"
                                    >
                                        <SelectAttendanceRadius
                                            :tempRadius="detailAttendance?.radius"
                                            @setRadius="setRadius"
                                        />
                                    </b-form-group>
                                </template>
                            </template>
                        </b-col>
                    </b-row>

                    <div class="row">
                        <div class="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                                <b-button v-if="isFromClass" type="reset" :disabled="isSubmit" variant="danger" @click="$emit('callbackCancel')">Batal</b-button>
                                <b-button v-else type="reset" :disabled="isSubmit" variant="danger">Reset</b-button>
                                <b-button type="submit" :disabled="isSubmit" variant="primary">Submit</b-button>
                            </div>
                        </div>
                    </div>
                </b-form>
            </div>
            <div class="card-body text-center" v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>
        <b-modal id="modalLoading" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center">
                <b-spinner label="Spinning" class="mr-3"></b-spinner><span>Loading...</span>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import fieldForm from '@/store/global/meet'
import SearchDropdownCheckbox from '../inputs/SearchDropdownCheckbox.vue'
import SelectVideoConference from '../inputs/SelectVideoConference.vue'
import SelectAttendanceRadius from '@/components/template/micro/inputs/SelectAttendanceRadius.vue'
import MapsAttendance from '@/components/template/micro/inputs/MapsAttendance.vue'

import { toDecrypt } from '~/commons/utils';
import moment from 'moment'

export default {
    layout: "dashboard",
    props: {
        title: {
            type: String,
            default: "Create Materi",
        },
        action: {
            type: String,
            default: "create",
        },
        customClass: {
            type: String,
            default: "col-lg-8 card-wrapper",
        },
        eventSlug: {
            type: String,
            default: "",
        },
        classroomId: {
            type: Number,
            default: -1,
        },
        isFromClass: {
            type: Boolean,
            default: false,
        },
        hideHeader: {
            type: Boolean,
            default: false,
        },
        isCard: {
            type: Boolean,
            default: true,
        },
        isAnnouncement: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        SearchDropdownCheckbox,
        SelectVideoConference,
        SelectAttendanceRadius,
        MapsAttendance,
    },
    data() {
        return {
            submitted: false,
            isLoaded: false,
            isSubmit: false,
            onEvent: {
                message: "",
                status: true,
                alertCounter: 0,
                variant: ""
            },
            inputForm: [],
            listCourse: [],
            // selectedCourse: null,
            selectedType: "offline",
            selectedPlatform: null,
            selectedPlatformLink: '',
            customInputPlatform: {
                place: "",
                content: ""
            },

            classId: Number(toDecrypt(localStorage.getItem('classId'))),
            classroomSlug: this.$route?.params?.classroom ?? '',

            isAttendance: true,
            detailAttendance: {},
            attendanceId: 0,
            detailMeet: null,
        };
    },
    filters: {
        capitalize: function (value) {
            if (!value)
                return "";
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
    computed: {
        ...mapState({
            settings: (state) => state?.Sass?.settings,
            meetsState: (state) => state.Meets,
            postState: (state) => state.Post,
            servicesState: (state) => state.Services
        })
    },
    created() {
        this.getCredentials();
    },
    methods: {
        setEvent(message, status) {
            window.scrollTo(0, 0);
            this.onEvent.message = message;
            this.onEvent.status = status;
            this.onEvent.variant = status == true ? "success" : "warning";
            this.onEvent.show = true;
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10;
        },
        getCredentials() {
            const url = this.$router.currentRoute.fullPath;
            var res = url.split("/");
            res.shift();
            this.fetchForm();
            // if (!this.isAnnouncement)
            //     this.fetchListCourse();
        },
        fetchForm() {
            if (this.isAnnouncement)
                this.inputForm = fieldForm?.inputFormAnnouncement;
            else
                this.inputForm = fieldForm?.inputForm;
            if (this.action == "edit" && this.eventSlug != null) {
                this.onResetForm();
                if (this.isAnnouncement)
                    this.fetchDataAnnouncement();
                else
                    this.fetchDataEvents().then(() => {
                        this.isAttendance = false;
                        if (this.attendanceId != 0) {
                            this.isAttendance = true;
                            this.fetchDetailAttendance();
                        }
                    });

            }
            else {
                this.onResetForm();
                this.isLoaded = true;
            }
        },
        async fetchDetailAttendance() {
            this.isLoaded = false
            await this.$store.dispatch('Services/getDetailAttendance', this.attendanceId)

            if (!this.servicesState.status) {
                console.error('Failed get detail attendance: ', this.servicesState?.message)
                this.setEvent(this.servicesState?.message, false)
                this.isLoaded = true
            } else {
                this.detailAttendance = {...this.servicesState?.data}
                this.isLoaded = true
            }
        },
        dateFilter(value) {
            if (value) {
                const splitDot = value.split(".");
                const splitZ = value.split("Z");
                if (splitDot.length > 1)
                    value = splitDot[0];
                else if (splitZ.length > 1)
                    value = splitZ[0];
            }
            return value;
        },
        async fetchDataEvents() {

            await this.$store.dispatch("Meets/detailMeetsV2", { 
                classroomSlug: this.classroomSlug, 
                eventSlug: this.eventSlug
            });

            if (!this.meetsState.status) {
                console.error("Failed fetch module", this.meetsState.message);
                this.setEvent(this.meetsState.message, this.meetsState.status);
                this.isLoaded = true;
            }
            else {
                // console.log('Success fetch courses', this.meetsState.courses)
                this.detailMeet = this.meetsState.detailMeet;
                this.attendanceId = this.detailMeet?.attendanceId
                this.inputForm.map((item, index) => {
                    switch (item.name) {
                        case "title":
                            this.inputForm[index].value = this.detailMeet.title;
                            break;
                        case "description":
                            this.inputForm[index].value = this.detailMeet.description;
                            break;
                        case "type":
                            if (this.detailMeet.type === 'offline') this.inputForm[index].value = this.detailMeet.type;
                            else {
                                this.inputForm[index].value = 'online';
                                this.selectedType = 'online'
                                this.selectedPlatform = this.detailMeet.type
                                this.selectedPlatformLink = this.detailMeet.content
                                this.customInputPlatform = {
                                    place: this.detailMeet?.place,
                                    content: this.detailMeet?.link ?? this.detailMeet?.content
                                }
                            }
                            break;
                        case "place":
                            this.inputForm[index].value = this.detailMeet.place;
                            break;
                        case "address":
                            this.inputForm[index].value = this.detailMeet.address;
                            break;
                        case "link":
                            this.inputForm[index].value = this.detailMeet.link;
                            break;
                        case "content":
                            this.inputForm[index].value = this.detailMeet.content;
                            break;
                        // case "topicIds":
                        //     if(detailMeet?.topicIds != null && detailMeet?.topicIds != []) {
                        //         detailMeet?.topicIds.map((item) => {
                        //             const courseIndex = this.listCourse.findIndex((data) => data.value === item)
                        //             if (courseIndex != -1) {
                        //                 this.listCourse[courseIndex].checked = true
                        //             }
                        //         })
                        //     }
                        //     break;
                        case "datetime":
                            this.inputForm[index].value = this.dateFilter(this.detailMeet.datetime);
                            break;
                        case "endDate":
                            this.inputForm[index].value = this.dateFilter(this.detailMeet.endDate);
                            break;
                        case "moduleId":
                            const found = this.listCourse?.find((item) => item.id == this.detailMeet.moduleId);
                            if (found)
                                this.selectedCourse = found;
                            this.inputForm[index].value = this.selectedCourse?.id;
                            break;
                        default:
                            break;
                    }
                });
                this.isLoaded = true;
            }
        },
        async fetchDataAnnouncement() {
            await this.$store.dispatch("Post/getDetailPostV2", this.eventSlug);

            if (!this.postState.status) {
                console.error("Failed fetch announcement", this.postState.message);
                this.setEvent(this.postState.message, this.postState.status);
                this.isLoaded = true;
            }
            else {
                // console.log('Success fetch courses', this.postState.courses)
                this.detailMeet = this.postState.post.post;
                this.inputForm.map((item, index) => {
                    switch (item.name) {
                        case "title":
                            this.inputForm[index].value = this.detailMeet.title;
                            break;
                        case "description":
                            this.inputForm[index].value = this.detailMeet.summary;
                            break;
                        case "type":
                            if (this.detailMeet.type === 'offline') this.inputForm[index].value = this.detailMeet.type;
                            else {
                                this.inputForm[index].value = 'online';
                                this.selectedType = 'online'
                                this.selectedPlatform = this.detailMeet.type
                                this.selectedPlatformLink = this.detailMeet.type === 'zoom' || this.detailMeet.type === 'gmeet' ? this.detailMeet.link : this.detailMeet.content
                                this.customInputPlatform = {
                                    place: this.detailMeet?.place,
                                    content: this.detailMeet?.link ?? this.detailMeet?.content
                                }
                            }
                            break;
                        case "place":
                            this.inputForm[index].value = this.detailMeet.place;
                            break;
                        case "address":
                            this.inputForm[index].value = this.detailMeet.address;
                            break;
                        case "link":
                            this.inputForm[index].value = this.detailMeet.link;
                            break;
                        // case "topicIds":
                        //     if(this.detailMeet?.topicIds != null && this.detailMeet?.topicIds != []) {
                        //         this.detailMeet?.topicIds.map((item) => {
                        //             const courseIndex = this.listCourse.findIndex((data) => data.value === item)
                        //             if (courseIndex != -1) {
                        //                 this.listCourse[courseIndex].checked = true
                        //             }
                        //         })
                        //     }
                        //     break;
                        case "content":
                            this.inputForm[index].value = this.detailMeet.content;
                            break;
                        case "datetime":
                            this.inputForm[index].value = this.dateFilter(this.detailMeet.start);
                            break;
                        case "endDate":
                            this.inputForm[index].value = this.dateFilter(this.detailMeet.end);
                            break;
                        case "moduleId":
                            const found = this.listCourse?.find((item) => item.id == this.detailMeet.moduleId);
                            if (found)
                                this.selectedCourse = found;
                            this.inputForm[index].value = this.selectedCourse?.id;
                            break;
                        default:
                            break;
                    }
                });
                this.isLoaded = true;
            }
        },
        async onPostEvents(params) {
            this.isSubmit = true;
            this.$bvModal.show("modalLoading");

            let dispatch = "Meets/storeMeets";
            let payload = params;

            if (this.action === "edit") {
                dispatch = "Meets/updateMeets";
                payload = {
                    params: params,
                    eventId: this.detailMeet?.id,
                };
            }

            await this.$store.dispatch(dispatch, payload);
            
            if (!this.meetsState.status) {
                console.error(`Failed ${this.action == "edit" ? "edit" : "create"} data`, this.meetsState.message);

                this.isSubmit = false;
                this.$bvModal.hide("modalLoading");

                setTimeout(() => {
                    this.setEvent(this.meetsState?.message, this.meetsState.status);
                }, 500);
            }
            else {
                // console.log('Success post course', this.meetsState.courses)
                let message = `Berhasil ${this.action == "edit" ? "Mengubah" : "Menambah"} Data.`;

                this.isSubmit = false;

                if (this.action != "edit")
                    this.onResetForm();
                if (!this.isFromClass)
                    this.$bvModal.hide("modalLoading");
                setTimeout(() => {
                    if (this.isFromClass) {
                        this.$bvModal.hide("modalLoading");
                        this.setEvent(message, this.meetsState.status);
                        setTimeout(() => {
                            this.$emit("callbackSubmit");
                        }, 1000);
                    }
                    else {
                        this.setEvent(message, this.meetsState.status);
                        setTimeout(() => {
                            this.$emit("callbackSubmit");
                        }, 1000);
                    }
                }, 500);
            }
        },
        async fetchPostAnnouncement(params) {
            this.isSubmit = true;
            this.$bvModal.show("modalLoading");

            var dispatch = "Post/createPost";

            params.kind = 7; // 7 is kind of announcement post on schedules
            params.summary = params.description;
            params.link = params.link;
            params.place = params.place;
            params.start = params.datetime;
            params.end = params.endDate;
            params.content = ""

            delete params.description;
            // delete params.link;
            delete params.datetime;
            delete params.endDate;

            var payload = params;

            // console.log(payload);

            if (this.action === "edit") {
                dispatch = "Post/editPost";
                payload = {
                    id: this.detailMeet?.id,
                    body: params,
                };
            }
            await this.$store.dispatch(dispatch, payload);
            if (!this.postState.status) {
                console.error(`Failed ${this.action == "edit" ? "edit" : "create"} data`, this.postState.message);
                this.isSubmit = false;
                this.$bvModal.hide("modalLoading");
                setTimeout(() => {
                    this.setEvent(`Failed ${this.action == "edit" ? "edit" : "create"} data`, this.postState.status);
                }, 500);
            }
            else {
                // console.log('Success post course', this.postState.courses)
                var message = `Berhasil ${this.action == "edit" ? "Mengubah" : "Menambah"} Data.`;
                this.isSubmit = false;
                if (this.action != "edit")
                    this.onResetForm();
                if (!this.isFromClass)
                    this.$bvModal.hide("modalLoading");
                setTimeout(() => {
                    if (this.isFromClass) {
                        this.$bvModal.hide("modalLoading");
                        this.setEvent(message, this.postState.status);
                        setTimeout(() => {
                            this.$emit("callbackSubmit");
                        }, 1000);
                    }
                    else {
                        this.setEvent(message, this.postState.status);
                        setTimeout(() => {
                            this.$emit("callbackSubmit");
                        }, 1000);
                    }
                }, 500);
            }
        },
        onSubmitForm(event) {
            event.preventDefault();

            // if (this.selectedType === "online" && !this.selectedCourse && !this.isAnnouncement) return this.setEvent("Pilih Topik Terlebih Dahulu!", false);

            if (this.selectedType === "online" && !this.selectedPlatform) return this.setEvent("Pilih Platform Video Conference Terlebih Dahulu!", false);

            if (this.selectedType === "online") {
                if (this.selectedPlatform !== 'manual') {
                    if (this.selectedPlatform !== this.settings?.meetType) return this.setEvent("Platform Video Conference Yang Terpilih Belum Tersambung Dengan LMS!", false);
                }
            }

            var output = {};

            this.inputForm.forEach(item => {
                if (item.name == "minScore")
                    output[item.name] = parseInt(item.value);
                else if (item.name === "datetime" || item.name === "endDate" || item.name == 'openTime' || item.name === 'closeTime') {
                    if (item.name === "datetime") {
                        let split = item.value.split(":");
                        output[item.name] = split.length == 2 ? `${item.value}:00` : item.value;

                        if (this.isAttendance) output['openTime'] = moment(item.value.replace('Z', '')).format('HH:mm:ss')
                    }
                    if (item.name === "endDate") {
                        let split = item.value.split(":");
                        output[item.name] = split.length == 2 ? `${item.value}:00` : item.value;

                        if (this.isAttendance) output['closeTime'] = moment(item.value.replace('Z', '')).format('HH:mm:ss')
                    }
                }
                else if (item.name === "type")
                    if (this.selectedType != 'online') output[item.name] = this.selectedType;
                    else output[item.name] = this.selectedPlatform;
                // else if (item.name === 'topicIds'){                    
                //     let topicIds = [];

                //     if(this.selectedCourse != null) {
                //         this.selectedCourse.map((item) => {
                //             topicIds.push(item.value)
                //         })
                //     }

                //     output[item.name] = topicIds;
                // }
                else if (item.name === 'addAttendance')
                    output[item.name] = this.isAttendance
                else
                    output[item.name] = item.value;
            });

            if (this.selectedType === 'online') {
                if (this.selectedPlatform === 'manual') {
                    output['place'] = this.customInputPlatform['place']
                    output['content'] = this.customInputPlatform['content']
                    output['link'] = this.customInputPlatform['content']
                } else {
                    delete output['place']
                }

                if (this.selectedPlatform !== 'manual') {
                    delete output['link']
                }
                
                // output['addAttendance'] = false
            }

            if (this.classId) output["classroomId"] = this.classId;
            delete output['meets']

            if (!this.isAttendance) {
                output['addAttendance'] = false
                delete output['radius']
                delete output['latitude']
                delete output['longitude']
                delete output['openTime']
                delete output['closeTime']
            }

            if (this.selectedType === 'online' && this.isAttendance) {
                output['radius'] = -1
                delete output['latitude']
                delete output['longitude']
            }

            // return console.log(output, "PARAMS")

            output.topicIds = -1;

            if (this.isAnnouncement) this.fetchPostAnnouncement(output);
            else this.onPostEvents(output);
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.name == "type")
                    item.value = "offline";
                else
                    item.value = "";
            });
        },
        async fetchListCourse() {
            const params = { classroomId: this.classId };
            await this.$store.dispatch("Services/topicsByClassId", params);
            if (!this.servicesState.status) {
                console.error("failed fetch classroom topic: ", this.servicesState.message);
                this.setEvent(this.servicesState.message, false);
            }
            else {
                const topics = this.servicesState.topics ?? []
                topics.map((item) => {
                    let object = {
                        value: item.id,
                        label: item.title,
                        checked: false,
                    }
                    this.listCourse.push(object)
                })
                this.fetchForm();
            }
        },
        onSubmitCustomPlatform(event) {
            this.customInputPlatform = event
            this.selectedPlatformLink = event?.content
        },

        onMapsClick(latlng) {
            this.inputForm.map((item, idx) => {
                if (item.name == 'latitude') this.inputForm[idx].value = latlng?.lat
                if (item.name == 'longitude') this.inputForm[idx].value = latlng?.lng
            })
        },
        setRadius(val) {
            this.inputForm.map((item, idx) => {
                if (item.name == 'radius') this.inputForm[idx].value = val
            })
        },
    },
}
</script>

<style>

</style>