<template>
    <template v-if="name === 'certificateStatus'">
        <div class="flex flex-col">
            <span class="pb-1 mr-2 text-sm text-gray-500">
                Update Certificate</span
            >
            <StatusBadge :status-id="value" show-no-status show-label />
        </div>
    </template>
    <template v-else>
        <div class="flex flex-col">
            <span class="pb-1 pr-2 text-gray-500">{{ attrLabel }}</span>
            <span class="overflow-ellipsis text-gray">{{ value }}</span>
        </div>
    </template>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'

    export default defineComponent({
        props: {
            name: { type: String, required: true },
            value: { type: String, required: true },
        },
        components: { StatusBadge },
        setup(props) {
            const { name } = toRefs(props)
            const labelMap = {
                userDescription: 'Update description',
                certificateStatus: 'Update certificate',
                ownerUsers:'Update Owners',
                ownerGroups:'Update Groups'
            }

            const attrLabel = computed(() => labelMap[name.value] || 'ATTR')

            return { attrLabel }
        },
    })
</script>
