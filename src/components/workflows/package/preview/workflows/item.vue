<template>
    <div class="p-2 border rounded">
        <div class="flex flex-col font-semibold cursor-pointer text-primary">
            {{ item.metadata.name }}
        </div>
        <div class="text-gray-500">
            <span>created {{ creationTimestamp(item, true) }} ago</span>
        </div>
        <div class="flex items-center text-gray-500" v-if="cronString(item)">
            <AtlanIcon icon="Clock"></AtlanIcon>
            <span class="ml-1 text-gray-700"> {{ cronString(item) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        components: {},
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
