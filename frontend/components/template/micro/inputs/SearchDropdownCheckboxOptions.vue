<template>
    <div class="custom-search-input">

        <div class="box-input">
            <b-form-input
                :id="id"
                v-model="inputText"
                :placeholder="placeholder"
                autocomplete="off"
                @blur="blurInput"
                @keyup.native="keyUpHandler"
                @click.native="eventHandler">
            </b-form-input>
            <div class="box-icon" @click="eventHandler">
                <i v-if="isCardOpen" class='ri-arrow-up-s-line'></i>
                <i v-else class='ri-arrow-down-s-line'></i>
            </div>
        </div>

        <b-card
            v-if="isCardOpen"
            no-body
            tabindex="0"
            @blur="blurDiv"
            :ref="`cardInput${ id }`"
            class="card-input mb-0">

            <template v-if="!isEmpty">
                <template v-if="options?.length != 0">
                    <div v-for="(item, index) in options" :key="index" class="checkbox-container">
                        <label :for="`${ id }-${ index }`" class="checkbox-label" @click="(...args)=>onChange(...args, item)">{{ item?.label }}</label>
                        <input :id="`${ id }-${ index }`" type="checkbox" :value="item?.value" v-model="item.checked" :name="`${ id }`" @click="(...args)=>onChange(...args, item)">
                    </div>

                    <div class="box-button">
                        <b-button variant="primary" block class="btn-submit-checkbox mt-2" @click="submit">{{ buttonTitle }}</b-button>
                    </div>
                </template>
                <div v-else class="checkbox-container">
                    <label :for="`${ id }-empty`" class="checkbox-label empty">Ketik untuk mencari</label>
                </div>
            </template>

            <div v-else class="checkbox-container">
                <label :for="`${ id }-empty`" class="checkbox-label empty">Tidak ada hasil untuk <em>{{ inputText }}</em></label>
            </div>

        </b-card>

        <small class="form-text text-muted">{{ description }}</small>

        <div id="city-selected" class="mx--1 mt-2">
            <template v-for="(item, index) in filteredData">
                <div v-if="item?.checked" :key="index" :class="`city-card m-1 ${ itemClass }`">
                    <p class="city">{{item.label}}</p>
                    <div class="d-flex flew-row align-items-center">
                        <p class="city mr-2">wajib</p>
                        <b-form-checkbox v-model="item.isReq" :ref="`${item.value}-ref`" @input="(...args)=>onReqChange(...args, item)"></b-form-checkbox>

                        <i class="ri-close-fill x fa-lg" @click="removeItem(index)"></i>
                    </div>
                </div>
            </template>
        </div>

        <!-- <small class="form-text text-muted" v-if="filteredData.length > 0">* Centang jika persyaratan diwajibkan</small> -->

    </div>
</template>

<script>

export default {
    props: {
        id: String,
        placeholder: String,
        description: String,
        itemClass: String,
        items: Array,
        buttonTitle: {
            type: String,
            default: "Pilih"
        }
    },
    data() {
        return {
            isEmpty: false,
            isCardOpen: false,
            inputText: "",
            options: [],
            filteredData: [],
        }
    },
    created() {
        this.options = this.items
        setTimeout(() => {
            this.onChange(null, null)
        }, 50);
    },
    watch: {
        inputText() {
            this.isCardOpen = true
            this.keyUpHandler()
        },
    },
    methods: {
        submit() {
            this.isCardOpen = false
            this.inputText = ""
        },
        eventHandler() {
            this.isCardOpen = !this.isCardOpen
        },
        blurInput() {
            setTimeout(() => {
                if (this.$refs?.[`cardInput${ this.id }`] != document?.activeElement) this.isCardOpen = false
            }, 50);
        },
        blurDiv() {
            setTimeout(() => {
                if (this.$refs?.[`cardInput${ this.id }`] != document?.activeElement) this.isCardOpen = false
            }, 50);
        },
        keyUpHandler() {
            const inputTerm = this.inputText?.toLowerCase()

            if (inputTerm) {

                var filteredData = this.items?.filter(function(obj) {
                    const searchTerm = obj['label']?.toLowerCase()
                    return searchTerm?.includes(inputTerm)
                });

                if (filteredData?.length === 0) this.isEmpty = true
                else {
                    this.isEmpty = false
                    this.options = filteredData
                }

            } else {
                this.isEmpty = false
                this.options = this.items
            }

        },
        removeItem(index){
            this.filteredData[index].checked = false
            this.onChange(null, null)
        },
        onChange(event, item) {
            if (event) {
                if (this.$refs?.[`cardInput${ this.id }`]?.contains(event?.target)) {
                    this.$refs?.[`cardInput${ this.id }`]?.focus()
                }
            }

            if (item) {
                if (item?.label?.toLowerCase() === 'semua kota') {
                    this.filteredData?.map((data, index) => {
                        if (data?.label?.toLowerCase() != 'semua kota') this.filteredData[index].checked = false
                    })
                } else {
                    const semuaKota = this.filteredData?.findIndex((data) => data?.label?.toLowerCase() === 'semua kota')
                    if (semuaKota > -1) this.filteredData[semuaKota].checked = false
                }
            }

            setTimeout(() => {

                var filteredData = this.items.filter(function(obj) {
                    return obj['checked'] === true;
                });

                this.items.forEach((item) => {
                    if (item['checked'] === false) item['isReq'] = false
                })

                // this.inputText = ""
                this.filteredData = filteredData
                this.$emit('onChange', filteredData)

            }, 50);
        },
        onReqChange() {
            setTimeout(() => {

                var filteredData = this.items.filter(function(obj) {
                    return obj['checked'] === true;
                });

                this.filteredData = filteredData
                this.$emit('onChange', filteredData)

            }, 50);
        }
    }
}

</script>

<style lang="scss" scoped> @import "@/assets/scss/components/micro/inputs/input-search.scss"; </style>