<template>
    <div class="flex items-center p-6 border rounded bg-blue-50 border-primary">
        <AtlanIcon class="mr-6 h-9" icon="InformationAnnouncement"/>
        <p class="flex flex-col text-gray-700 gap-y-1.5">
            <h3 class="text-lg font-bold">{{data?.attributes?.announcementTitle}}</h3>
            <span>{{data?.attributes?.announcementMessage}} </span>
            <div class="text-sm">
                <span >{{data?.attributes?.announcementUpdatedBy}}</span> 
                <span class="ml-1 text-gray-500">{{updatedDate}}</span>
            </div>
        </p>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import dayjs from 'dayjs'
    import useTenant from '~/composables/tenant/useTenant'

    export default defineComponent({
        name: "Annoucements",
        setup() {
            const {data} = useTenant()
            const updatedDate = computed(() => dayjs(Number(data.value?.attributes?.announcementUpdatedAt )|| new Date()).format('MMM DD, YYYY'))
            // const updatedDate = ""
            return {
                data,
                updatedDate
            }
        },
    })
</script>

<style scoped></style>
