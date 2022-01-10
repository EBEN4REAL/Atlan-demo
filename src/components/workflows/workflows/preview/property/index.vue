<template>
    <div class="flex flex-col w-full h-full px-5 py-4 overflow-auto gap-y-3">
        <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-500">Properties</span>
        </div>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Name</span>

            <div class="flex flex-col">
                <div class="flex">{{ item?.metadata?.name }}</div>
            </div>
        </div>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Created</span>

            <div class="flex flex-col">
                <div class="flex">
                    {{ creationTimestamp(item, false) }}
                </div>
            </div>
        </div>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Schedule</span>

            <div class="flex flex-col">
                <div class="flex" v-if="cronString(item)">
                    {{ cronString(item) }}
                </div>
                <span v-else>No Schedule</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            PopOverUser,
        },
        props: {
            item: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { item } = toRefs(props)

            const { creationTimestamp, cronString } = useWorkflowInfo()

            return { item, creationTimestamp, cronString }
        },
    })
</script>
