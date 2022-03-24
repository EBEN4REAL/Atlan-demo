<template>
    <div class="p-2 border rounded cursor-pointer" @click="handleClick">
        <div class="flex items-center justify-between">
            <span class="font-semibold truncate text-primary">{{
                item.metadata.name
            }}</span>
            <Dropdown :options="dropdownOptions" @click.stop />
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
                >created {{ creationTimestamp(item, true) }} ago
                <template
                    v-if="
                        creatorUsername(item)?.startsWith(
                            'service-account-apikey-'
                        )
                    "
                >
                    using <AtlanIcon icon="Key" class="h-3" /> API key
                </template>
                <template v-else>
                    by
                    {{ creatorUsername(item) }}
                </template>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, toRefs } from 'vue'
    import { useRouter } from 'vue-router'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import LastRun from './lastRun.vue'
    import Dropdown from '@/UI/dropdown.vue'

    export default defineComponent({
        name: 'SidebarItem',
        components: { LastRun, Dropdown },
        props: {
            item: {
                type: Object,
                required: true,
            },
            packageObject: {
                type: Object,
                required: true,
            },
        },
        emits: ['archive'],
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

            const dropdownOptions = [
                {
                    title: 'Delete',
                    icon: 'Trash',
                    class: 'text-red-700',
                    handleClick: () =>
                        emit('archive', item.value?.metadata?.name),
                },
            ]
            return {
                creationTimestamp,
                cronString,
                handleClick,
                creatorUsername,
                runs,
                runMap,
                dropdownOptions,
            }
        },
    })
</script>
