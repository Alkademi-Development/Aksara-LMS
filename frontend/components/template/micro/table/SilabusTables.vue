<template>
    <table class="table-silabus">
        <colgroup>
            <col v-if="role == 'course'" class="col-2"> 
            <col :class="role == 'course' ? 'col-5' : 'col-6'"> 
            <col :class="role == 'course' ? 'col-5' : 'col-6'"> 
        </colgroup>

        <thead>
        <tr>
            <th v-if="role == 'course'">No.</th>
            <th>{{role == 'course' ? 'Materi' : ''}}</th>
            <th>{{role == 'course' ? 'Point' : ''}}</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in dataTables" :key="index">
                <td v-if="role == 'course'" class="no">{{index + 1}}</td>
                <td >
                    <h5 class="title">{{item.title}}</h5>
                    <p v-if="role == 'course'" class="description">{{item.description}}</p>
                </td>
                <td>
                    <p v-if="role == 'meet'" class="description">{{item.value}}</p>
                    <ul v-else >
                        <li v-for="(list, i) in item.list" :key="i">{{list}}</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        data: null,
        role: String
    },
    data() {
        return {
            dataTables: this.data
        }
    }
}
</script>