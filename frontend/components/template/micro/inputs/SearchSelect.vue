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

            <div class="d-flex">
                <div v-if="canCancelItem && inputText" class="box-icon icon-cancel" @click="onCancelItem">
                    <i class="ri-close-line"></i>
                </div>
                <div class="box-icon" @click="eventHandler">
                    <i v-if="isCardOpen" class='ri-arrow-up-s-line'></i>
                    <i v-else class='ri-arrow-down-s-line'></i>
                </div>
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
                        <label class="checkbox-label" @click="onChange(item)">{{ item?.label }}</label>
                    </div>

                </template>
                <div v-else class="checkbox-container">
                    <label :for="`${ id }-empty`" class="checkbox-label empty">Ketik untuk mencari</label>
                </div>
            </template>

            <div v-else class="checkbox-container">
                <label :for="`${ id }-empty`" class="checkbox-label empty">Tidak ada hasil untuk <em>{{ inputText }}</em></label>
            </div>

            <div v-if="withAction" class="box-button">
                <b-button :variant="actionVariant" block class="btn-submit-checkbox mt-2" @click="submit">{{ actionTitle }}</b-button>
            </div>

        </b-card>

        <small class="form-text text-muted">{{ description }}</small>

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
        text: String,
        withAction: Boolean,
        actionVariant: String,
        actionTitle: {
            type: String,
            default: "Button"
        },
        requestChangeValue: {
            type: Object,
            default: () => null
        },
        isListUpdate: {
            type: Boolean,
            default: true,
        },
        canCancelItem: {
            type: Boolean,
            default: false,
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
    mounted(){
        this.$nextTick(() => {
            if (this.text) this.inputText = this.text
        })
        this.options = [...this.items]
    },
    watch: {
        requestChangeValue() {
            if (this.requestChangeValue != null) this.onChange(this.requestChangeValue)
        },
        isListUpdate() {
            this.options = [...this.items]
        },
        isCardOpen(state){
            if(!state) this.inputText =  this.text;
        }
    },
    methods: {
        submit() {
            this.$emit("actionSubmit")
        },
        eventHandler() {
            this.isCardOpen = !this.isCardOpen
        },
        blurInput() {
            setTimeout(() => {
                if (this.$refs?.[`cardInput${ this.id }`] != document?.activeElement && !this.withAction) this.isCardOpen = false
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
                this.options = [...this.items]
            }

        },
        onChange(item) {
            
            this.$emit('onChange', item)

            setTimeout(() => {
                this.inputText = item?.label
                this.isCardOpen = false
            }, 50);

        },
        onCancelItem(){
            this.$emit("onChange", null);
            setTimeout(() => {
                this.inputText = "";
            }, 50);
        }
    }
}

</script>

<style lang="scss" scoped> @import "@/assets/scss/components/micro/inputs/input-search.scss"; </style>