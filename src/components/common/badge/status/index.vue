<template>
    <div :key="statusId">
        <div class="flex items-center align-middle" v-if="!showChipStyleStatus">
            <span class="svg-icon">
                <component class="w-auto h-4" :is="icon" />
            </span>

            <p v-if="showLabel" class="mb-0 ml-2">
                {{ label }}
            </p>
        </div>

        <div
            v-else
            class="flex items-center px-3 py-1 mr-3 text-sm text-gray-700 border rounded-full cursor-pointer "
        >
            <span class="svg-icon">
                <component class="w-auto h-4" :is="icon" />
            </span>

            <p v-if="showLabel" class="mb-0 ml-2">
                {{ label }}
            </p>
        </div>

        <p
            v-if="showLabel && statusId && statusUpdatedBy"
            class="mt-1 mb-0 text-xs leading-none text-gray-700"
        >
            {{ timeAgo(statusUpdatedAt) }}
            by
            {{ statusUpdatedBy }}
        </p>
    </div>
</template>

<script lang="ts">
    import { useTimeAgo } from '@vueuse/core'
    import { defineComponent, computed, toRefs } from 'vue'
    import { List } from '~/constant/status'

    export default defineComponent({
        props: {
            statusId: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            statusMessage: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            statusUpdatedBy: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            statusUpdatedAt: {
                required: false,
            },
            showLabel: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            showNoStatus: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            showChipStyleStatus: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change'],
        setup(props) {
            const { statusId, showNoStatus } = toRefs(props)
            const statusObject = computed(() => {
                let found = List.find((item) => item.id === statusId.value)
                if (showNoStatus.value && !found) {
                    found = List.find((item) => item.id === 'is_null')
                }
                return found
            })
            const icon = computed(() => statusObject.value?.icon)
            const label = computed(() => statusObject.value?.label)

            const timeAgo = (time: string | number) => useTimeAgo(time).value
            return { statusId, icon, label, timeAgo }
        },
    })
</script>
