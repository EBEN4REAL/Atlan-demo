<template>
    <div v-if="data.value?.attributes.announcementTitle" class="mb-0">
        New <b>Announcement</b> was added
        <AnnouncementWidget
            :selected-asset="data.value"
            class="mt-1"
            :allowEdit="false"
        ></AnnouncementWidget>
    </div>
    <div v-else>
        <div v-if="data.value?.attributes.announcementTitle === ''">
            <div class="mb-3"><b>Announcement </b> was removed</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, onMounted } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { List as statusList } from '~/constant/status'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'

    export default defineComponent({
        name: 'StatusActivity',
        components: { AnnouncementWidget },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: {} }
                },
            },
        },
        setup(props) {},
    })
</script>
