<template>
    <div class="row d-flex align-items-center mb-4">

        <div class="col-6">
            <h5 class="mb-0">{{ title }}</h5>
        </div>

        <div v-if="withAction" class="col text-right">
            <ButtonDropdownFilter
                v-if="actionType == 'dropdown'"
                id="section-header-dropdown"
                :toggleClass="actionClass"
                :text="actionLabel"
                :variant="actionVariant"
                :items="actionOptions"
                :selectedItem="actionSelected"
                @onChange="optionChanged"
            />
            <nuxt-link
                v-else-if="actionType == 'link' && actionLink"
                id="section-header-link"
                :to="actionLink"
                :class="actionClass"
            >{{ actionLabel }}</nuxt-link>
        </div>

    </div>
</template>

<script>
import ButtonDropdownFilter from "@/components/template/micro/buttons/ButtonDropdownFilter.vue";

const EMIT_OPTION_CHANGED = "optionChanged"

export default {

    components: {
        ButtonDropdownFilter
    },

    methods: {
        optionChanged(event) {
            this.$emit(EMIT_OPTION_CHANGED, event)
        }
    },

    props: {
        title: {
            type: String,
            default: "Section Title"
        },
        withAction: {
            type: Boolean,
            default: false
        },
        actionType: {
            type: String,
            default: "button" // button | dropdown | link
        },
        actionClass: {
            type: String,
            default: "px-3 py-2"
        },
        actionLabel: {
            type: String,
            default: "Click Me"
        },
        actionVariant: {
            type: String,
            default: "outline-primary",
        },
        actionOptions: {
            type: Array,
            default: () => []
        },
        actionSelected: {
            type: Object,
            default: () => null
        },
        actionLink: {
            type: String,
            default: "#"
        }
    },

}
</script>

<style>
#section-header-link.text-primary:hover {
    color: var(--bs-primary) !important;
}
</style>