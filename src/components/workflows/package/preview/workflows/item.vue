<template>
    <div class="p-2 border rounded cursor-pointer">
        <div
            class="flex flex-col font-semibold cursor-pointer text-primary"
            @click="handleClick"
        >
            {{ item.metadata.name }}
        </div>
        <!-- {{ runs(item.metadata.name) }} -->

        <LastRun
            :item="packageObject"
            :runs="runs(item.metadata.name)"
            :workflow="item.metadata.name"
        ></LastRun>
        <div class="flex items-center text-gray-500" v-if="cronString(item)">
            <span>Scheduled</span>
            <span class="ml-1 text-gray-700"> {{ cronString(item) }}</span>
        </div>
        <div class="mt-1 text-gray-500">
            <span
                >created {{ creationTimestamp(item, true) }} ago by
                {{ creatorUsername(item) }}</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, toRefs } from 'vue'
    import { useRouter } from 'vue-router'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import LastRun from './lastRun.vue'

    export default defineComponent({
        components: { LastRun },
        props: {
            item: {
                type: Object,
                required: false,
            },
            packageObject: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { item, packageObject } = toRefs(props)

            const { creationTimestamp, cronString, creatorUsername } =
                useWorkflowInfo()
            const router = useRouter()

            const handleClick = () => {
                router.push(`/workflows/${item.value?.metadata?.name}`)
            }

            const runMap = inject('runMap')

            const runs = (workflow) => runMap.value[workflow]

            return {
                item,
                creationTimestamp,
                cronString,
                handleClick,
                creatorUsername,
                packageObject,
                runs,
                runMap,
            }
        },
    })
</script>
