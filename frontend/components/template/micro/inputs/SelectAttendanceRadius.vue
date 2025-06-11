<template>
    <div>
        <b-row>
            <b-col
                v-for="(rad, index) in radiusList"
                :key="index"
                class="mb-3"
                @click="onRadClick(rad, index)"
            >
                <div
                    :class="`btn form-control w-100 ${rad.isSelected ? 'btn-primary' : 'btn-outline-gray color-black'}`"
                >{{ rad.name }}</div>
            </b-col>
        </b-row>

        <!-- <small>Custom radius (meter)</small>
        <b-row>
            <b-col cols="12" md="4" lg="3">
                <b-form-input v-model="customVal" @input="(args) => onRadChange(args)"></b-form-input>
            </b-col>
        </b-row> -->

        <div>
            <b-form-checkbox
                v-model="unlimited"
                :value="true"
                :unchecked-value="false"
            >Tidak Terbatas</b-form-checkbox>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tempRadius: {
            type: Number,
            default: 0
        },
        onResetClick: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            radiusList: [
                { name: '20 Meter', value: 20, isSelected: false },
                { name: '50 Meter', value: 50, isSelected: false },
                { name: '100 Meter', value: 100, isSelected: false },
                { name: '200 Meter', value: 200, isSelected: false },
            ],
            valSelectedRadius: 0,

            customVal: '',
            unlimited: false
        }
    },
    created() {
        this.setSelectedRadius()
    },
    watch: {
        unlimited() {
            if (this.unlimited) {
                this.radiusList.map((rad) => rad.isSelected = false)

                this.$emit('setRadius', -1)
            }
        },
        onResetClick() {
            this.radiusList.map((rad) => rad.isSelected = false)
            this.unlimited = false
        }
    },
    methods: {
        onRadClick(radius, index) {
            this.unlimited = false
            this.customVal = ''
            this.onRadChange()

            this.radiusList.map((rad) => rad.isSelected = false)
            this.radiusList[index].isSelected = true
            
            this.valSelectedRadius = radius.value

            this.$emit('setRadius', radius.value)
        },
        onRadChange(args) {
            this.radiusList.map((rad) => rad.isSelected = false)

            this.$emit('setRadius', parseInt(this.customVal))
        },
        setSelectedRadius() {
            if (this.tempRadius != 0) {
                this.customVal = this.tempRadius

                this.radiusList.map((rad) => {
                    if (rad.value == this.tempRadius) {
                        this.customVal = ''
                        return rad.isSelected = true

                    } else return rad.isSelected
                })

                if (this.tempRadius == -1) this.unlimited = true

                this.$emit('setRadius', parseInt(this.customVal))
            }
        }
    }
}
</script>