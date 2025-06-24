<template>
    <b-dropdown 
        :id="id" 
        :text="items?.length > 0 ? text : 'Memuat...'" 
        right
        :variant="variant" 
        :toggle-class="toggleClass"
        :class="`wrapper-dropdown ${refMenuClass}`"
        :menu-class="menuClass"
        :disabled="items?.length > 0 ? false : true"
    >
        <b-dropdown-item 
            v-for="(item, idx) in items" 
            :key="idx"
            :value="item?.value"
            @click="onChange(item)"
            :disabled="item?.value == selectedItem?.value"
            :class="itemClass"
        >
            {{ item?.label | truncate }}
        </b-dropdown-item>
        <div v-if="isLoadMoreClass" class="w-100 d-flex justify-content-center align-items-center py-2">
            <b-spinner label="Spinning" variant="primary" style="width: 25px; height: 25px;"></b-spinner>
        </div>
    </b-dropdown>
</template>

<script>

export default {
    props: {
        id: String,
        toggleClass: String,
        menuClass: String,
        variant: String,
        text: String,
        items: Array,
        selectedItem: Object,
        noDefaultValue: Boolean,
        isLoaded: Boolean,
        isLoadMoreClass: Boolean,
        pagination: Object,
        itemClass: String,
        refMenuClass: String,
    },
    filters: {
        truncate(str) {
            const clip = 155
            return (str.length > clip) ? str.substr(0, clip-1) + '...' : str;
        },
    },
    mounted() {
        this.setInitialFilters();
        if(this.isLoaded) this.setInfiniteScroll();
    },
    watch: {
        items() {
            if (this.id == 'top-header-filter') this.setInitialFilters()
        },
        isLoaded(state){
            if(state) this.setInfiniteScroll();
        }
    },
    methods: {
        setInitialFilters() {
            if (this.items?.length > 0 && !this.noDefaultValue) {
                if (this.selectedItem) this.$emit('onChange', this.selectedItem)
                else this.$emit('onChange', this.items?.[0])
            }
        },
        onChange(item) {
            this.$emit('onChange', item)
        },
        setInfiniteScroll(){
            const wrapperList = document.querySelector(`.${this.refMenuClass || 'wrapper-dropdown'} .dropdown-menu`);
            if(wrapperList){
                wrapperList.addEventListener("scroll", () => {
                    const isBottom = Math.floor(wrapperList?.scrollHeight) - Math.floor(wrapperList?.scrollTop) <= Math.floor(wrapperList?.clientHeight) + 1;
                    if(isBottom && this.pagination?.page < this.pagination?.totalPages && !this.isLoadMoreClass){
                        this.$emit("onChangePage");
                    }
                })
            }
        }
    },
}

</script>

<style lang="scss" scoped>
.b-dropdown ::v-deep {
    button {
        line-height: 150%;
    }
    .dropdown-toggle[aria-expanded="true"] {
        color: white !important;
    }
}
.style-2 ::v-deep {
    button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: black;
        gap: 12px;

        &:hover {
            color: white;
        }
    }
    &.btn-group.show .dropdown-toggle {
        color: white !important;
    }
    .btn-outline-primary.disabled, .btn-outline-primary:disabled {
        &:hover {
            color: black;
        }
    }

    .dropdown-menu {
        max-height: 300px;
        overflow: scroll;
    }
}

.wrapper-dropdown ::v-deep {
    .dropdown-menu {
        max-height: 300px;
        overflow: scroll;

        &.max-w--default{
            max-width: 200px;
        }

        &::-webkit-scrollbar-track{
            background: white;
        }
    }
}

.btn-outline-primary.dropdown-toggle {
    color: unset !important;
}

.dropdown-menu{
    overflow-x: hidden;
}
</style>