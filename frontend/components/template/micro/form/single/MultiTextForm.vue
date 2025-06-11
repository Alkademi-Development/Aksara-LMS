<template>
    <div >
        <b-form-group
            :label="input?.label"
            :label-for="input?.label"
            v-if="!isBusy"
        >
            <div class="row">
                <div 
                    class="col-6 mb-2" 
                    v-for="(item, idx) in items" 
                    :key="`item-${idx}`"
                >
                    <div class="d-flex flex-row align-items-center justify-content-between mb-2">
                        <small>{{ input?.label.split(' ')?.[0] }} {{ idx + 1 }}</small>
                        <div class="cursor-pointer pt-1 pl-1" @click="removeItem(idx)">
                            <i class="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <div v-for="(singleItem, index) in item" :key="`single-${idx}-${index}`">
                        <!-- <div v-if="singleItem.label === 'icon'">
                            <label class="sr-only" :for="items[idx][index].label">Ni Icon</label>
                            <b-input-group class="mb-2">
                                <template #prepend>
                                    <b-input-group-text >
                                        <i :class="`ni ${!!items[idx][index].value ? items[idx][index].value : 'ni-spaceship'}`"></i>
                                    </b-input-group-text>
                                </template> 
                                <b-form-input 
                                    v-model="items[idx][index].value"
                                    placeholder="Icon"
                                    :id="`${items[idx][index].label}-${idx}-${index}`"
                                    :value="items[idx][index]?.value"
                                ></b-form-input>
                            </b-input-group>
                        </div> -->
        
                        <b-form-group class="mb-2" v-if="singleItem.label === 'title'">
                            <b-form-input
                                v-model="items[idx][index].value"
                                :id="`${items[idx][index].label}-${idx}-${index}-title`"
                                :value="items[idx][index]?.value"
                                :type="items[idx][index].type"
                                :placeholder="!!items[idx][index].placeholder ? items[idx][index].placeholder : items[idx][index].label | capitalize"
                                :required='items[idx][index].required'
                            ></b-form-input>
                        </b-form-group>
                        
                        <b-form-group class="mb-0" v-if="singleItem.label === 'description'">
                            <b-form-textarea
                                v-model="items[idx][index].value"
                                :id="`${items[idx][index].label}-${idx}-desc`"
                                :value.sync="items[idx][index].value"
                                :type="items[idx][index].type"
                                :placeholder="!!items[idx][index].placeholder ? items[idx][index].placeholder : items[idx][index].label | capitalize"
                                :required='items[idx][index].required'
                                rows="4"
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </div>
            </div>
            
            <b-button 
                size="sm" 
                variant="primary" 
                :disabled="false"
                @click="createItem()"
            >
                Tambah {{ input.label.split(' ')?.[0] }} Baru
            </b-button>
        </b-form-group>
        <div class="card-body text-center" v-else>
            <b-spinner label="Spinning"></b-spinner>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        action: {
            type: String,
            default: 'create'
        },
        input: {
            type: Object,
            default: () => {}
        },
        defaultInput: {
            type: Array,
            default: () => []
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
    },  
    data() {
        return {
            isBusy: true,
            singleItems: [],
            items: [],
        }
    },
    created() {
        setTimeout(() => {
            this.setItems()            
        }, 1000);
    },
    methods: {
        removeItem(idx) {
            let filteredItems = this.items.filter((_item, index) => { return index != idx; }); 

            this.items = filteredItems

            this.$emit('onRemoveItem', this.input.name, this.items)
        },
        createItem() {
            let copyItem = JSON.parse(JSON.stringify(this.singleItems))
                
            copyItem?.map((item) => item.value = "" )
            
            this.items.push([...copyItem])
        },  
        setItems() {
            const findInput = this.defaultInput.findIndex((input) => input.name === this.input.name)
            this.singleItems = this.defaultInput?.[findInput]?.items[0]

            if (!!this.input?.items) {
                this.items = this.input?.items                
            }

            this.isBusy = false
        }
    }
}
</script>