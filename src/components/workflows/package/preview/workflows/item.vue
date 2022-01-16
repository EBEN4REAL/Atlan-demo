<template>
    <div class="p-2 border rounded cursor-pointer">
        <div
            class="flex flex-col font-semibold cursor-pointer text-primary"
            @click="handleClick"
        >
            {{ item.metadata.name }}
        </div>
        <div class="text-gray-500">
            <span
                >created {{ creationTimestamp(item, true) }} ago by
                {{ creatorUsername(item) }}</span
            >
        </div>
        <div class="flex items-center text-gray-500" v-if="cronString(item)">
            <AtlanIcon icon="Clock"></AtlanIcon>
            <span class="ml-1 text-gray-700"> {{ cronString(item) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import { useRouter } from 'vue-router'
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

            const { creationTimestamp, cronString, creatorUsername } =
                useWorkflowInfo()
            const router = useRouter()

            const handleClick = () => {
                router.push(`/workflows/${item.value?.metadata?.name}`)
            }

            return {
                item,
                creationTimestamp,
                cronString,
                handleClick,
                creatorUsername,
            }
        },
    })
</script>
