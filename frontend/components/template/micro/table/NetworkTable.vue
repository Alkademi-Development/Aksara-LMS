<template>
    <div class="table-container">
        <table>
            <colgroup>
                <col class="col-1">
                <col class="col-8">
                <col class="col-1">
                <col class="col-2">
            </colgroup>

            <thead>
            <tr hidden>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in dataTables" :key="index">
                    <td :class="{'end':index == dataTables.length-1}">
                        <h1 :class="['type', item.type]">{{item.type}}</h1>
                    </td>
                    <td :class="{'end':index == dataTables.length-1}">
                        <div class="content">
                            <h5>{{item.title}}</h5>
                            <p>{{item.description}}</p>
                        </div>
                    </td>
                    <td :class="{'end':index == dataTables.length-1}">
                        <h6 :class="['status', item.status]">
                            {{item.status}}
                        </h6>
                    </td>
                    <td :class="{'end':index == dataTables.length-1}">
                        <div class="eye"><img src="/dashboard/assets/image/eye-black.svg" alt=""></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        data: null
    },
    data() {
        return {
            dataTables: this.data
        }
    }
}
</script>