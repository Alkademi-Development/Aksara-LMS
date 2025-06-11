<template>
    <div>
        <div class="header">
            <div class="row">
                <h3 class="col col-lg-7">{{title}}</h3>
                <a href="#" class="col col-lg-5">VIEW ALL <img src="@/assets/img/icons/common/arrow-right.svg" alt=""></a>
            </div>
        </div>
        <div class="card-table">
            <div class="header-table">
                <h3>{{tableTitle}}</h3>
            </div>
            <div class="body-table">
                <NetworkTable :data="dataTables"/>
            </div>
        </div>
    </div>
</template>

<script>
import NetworkTable from "@/components/template/micro/table/NetworkTable.vue"

export default {
    components:{
        NetworkTable
    },
    props: {
        data: Object
    },
    data(){
        return {
            title: this.data.title,
            tableTitle: this.data.tableTitle,
            dataTables: this.data.dataTables
        }
    }
}
</script>