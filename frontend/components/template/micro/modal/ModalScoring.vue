<template>
    <b-modal
        v-if="isModalOpen"
        v-model="isModalOpen" 
        :title="`${item?.userName} - ${activeAssignment?.title}`"
        ok-title="Batal"
        cancel-title="Submit"
        ok-variant="danger"
        cancel-variant="primary"
        body-class="pt-0"
        size="lg"
        hide-footer
        no-close-on-esc
        no-close-on-backdrop
        centered
        @close="$emit('toggleModal')"
        >
        <b-form @submit="$emit('onSubmit', $event)">
            <b-form-group label="Nilai *" label-for="input-score" description="* Range nilai 0 - 100">
                <b-form-input id="input-score" v-model="item.score" type="number" min="0" max="100" required></b-form-input>
            </b-form-group>
            <b-form-group label="Catatan" label-for="input-note">
                <DescriptionEditor
                    id="input-note"
                    v-model="item.mentorNotes"
                    :height="200"
                />
            </b-form-group>
            <p v-if="modalError" class="text-danger mb-2">{{ modalError }}</p>
            <div class="d-flex justify-content-start align-items-center w-100">
                <template v-if="!isScoring">
                    <b-button size="sm" variant="primary" type="submit">Submit</b-button>
                    <b-button size="sm" variant="danger" @click="$emit('toggleModal')">Cancel</b-button>
                </template>
                <template v-else>
                    <b-button size="sm" variant="primary" disabled>Loading...</b-button>
                </template>
            </div>
        </b-form>
    </b-modal>
</template>

<script>
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue"

export default {
    components: {
        DescriptionEditor
    },
    props: {
        onOpenModal: Boolean,
        isScoring: Boolean,
        modalError: String,
        item: {
            type: Object,
            default: () => null
        },
        activeAssignment: {
            type: Object,
            default: () => null
        },
    },

    data() {
        return {
            isModalOpen: false,
            // item: null
        }
    },
    
    mounted(){
        document.addEventListener("focusin",this.focusinTox, true);
    },
    beforeDestroy(){
        document.removeEventListener("focusin",this.focusinTox, true);
    },
    methods: {
        focusinTox(event){
            if ($(event.target).closest('.tox-dialog').length) {
                event.stopImmediatePropagation();
            }
        }
    },
    // mounted() {
    //     this.item = { ...this.item }
    // },

    watch: {
        onOpenModal() {
            this.isModalOpen = this.onOpenModal
        },
        // isModalOpen() {
        //     if (!this.isModalOpen) this.$emit('toggleModal')
        // }
    },
}
</script>