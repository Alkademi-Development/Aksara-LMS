<template>
    <b-card no-body>
        <b-card-body>
            <b-row align-v="center">
                <b-col>
                    <b-card-title class="mb-2">{{item.module}}</b-card-title>
                    <!-- <b-card-text>
                        <b-button v-if="item.studioId != null && item.studioId != ''" size="sm" variant="primary" @click="onClickTask(item.studioId, 'jongstudio')">
                            <span class="btn-inner--text">Jong Studio</span>
                        </b-button>
                        <b-button v-if="item.repository != null && item.repository != ''" size="sm" variant="danger" @click="onClickTask(item.repository, 'other')">
                            <span class="btn-inner--text">Link Tugas</span>
                        </b-button>
                    </b-card-text> -->
                </b-col>
                <b-col md="3" class="text-right">
                    <b-avatar
                        :class="item.score < 75 ? 'badge-danger' : 'badge-success'"
                        size="4rem"
                        variant="primary" 
                        :text="`${item.score}`"
                        >
                    </b-avatar>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    props: {
        item: Object,
    },

    methods: {
        onClickTask (url, type) {
            if(type == 'jongstudio') {
                var token = localStorage.getItem('access_token')
                const EDITOR_URL = process.env.editorURL;

                window.open(`${EDITOR_URL}editor?editor_id=${url}&token=${token}`, '_blank');
            } else {
                window.open(url, '_blank');
            }
        },
    }
}
</script>