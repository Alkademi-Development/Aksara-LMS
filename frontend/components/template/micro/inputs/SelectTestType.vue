<template>
    <div>
        <b-row>
            <b-col
                v-for="(test, index) in testTypes"
                :key="index"
                class="mb-3"
                @click="onTestClick(test, index)"
            >
                <div
                    :class="`btn form-control px-3 w-100 h-100 text-left ${test.isSelected ? 'btn-primary' : 'btn-outline-gray color-black'}`"
                >
                    <div class="mb-2">{{ test.name }}</div>
                    <div style="font-size: 12px">{{ test.desc }}</div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
export default {
    props: {
        tempDays: {
            type: Array,
            default: () => []
        },
        onResetClick: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            days: [
                { id: 0, name: 'Minggu', isSelected: false },
                { id: 1, name: 'Senin', isSelected: false },
                { id: 2, name: 'Selasa', isSelected: false },
                { id: 3, name: 'Rabu', isSelected: false },
                { id: 4, name: 'Kamis', isSelected: false },
                { id: 5, name: 'Jumat', isSelected: false },
                { id: 6, name: 'Sabtu', isSelected: false },
            ],
            selectedDays: { days: [] },
            allDays: 'noDays',

            testTypes: [
                { name: 'Pre-Test', desc: 'Dikerjakan sebelum peserta masuk kelas', isSelected: false },
                { name: 'Post-Test', desc: 'Dikerjakan setelah peserta menyelesaikan kelas', isSelected: false },
            ]
        }
    },
    created() {
        this.setSelectedDays()
    },
    watch: {
        allDays() {
            if (this.allDays == 'all') {
                this.selectedDays.days = this.days.map((day) => day.id)
                this.days.map((day) => day.isSelected = true)
            } else if (this.allDays == 'noDaySelected') {
                this.selectedDays.days = []
                this.days.map((day) => day.isSelected = false)
            }

            this.$emit('setDays', this.selectedDays)
        },
        onResetClick() {
            this.selectedDays.days = []
            this.days.map((day) => day.isSelected = false)
        }
    },
    methods: {
        onDayClick(day, index) {
            this.days[index].isSelected = !this.days[index].isSelected
            
            this.allDays = 'all'
            this.selectedDays.days = []
            this.days.map((day) => {
                if (!day.isSelected) this.allDays = 'some'
                if (day.isSelected) this.selectedDays.days.push(day.id)
            })

            this.$emit('setDays', this.selectedDays)
        },
        onTestClick(test, idx) {
            this.testTypes.map(test => test.isSelected = false)
            this.testTypes[idx].isSelected = true
        },
        setSelectedDays() {
            if (this.tempDays.length > 0) {
                this.tempDays.map((item) => {
                    this.days.map((day) => item == day.id ? day.isSelected = true : day.isSelected)
                })

                if (this.tempDays.length == 7) this.allDays = 'all'

                this.$emit('setDays', this.tempDays)
            }
        }
    }
}
</script>