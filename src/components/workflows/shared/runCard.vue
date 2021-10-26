<template>
    <div
        class="flex items-center gap-3 px-4 py-2"
        :class="{
            'bg-primary-light': currRunName === r.name,
            'hover:bg-gray-100 cursor-pointer': selectEnabled,
        }"
        @click="() => emit('select', r.name)"
    >
        <AtlanIcon
            :icon="
                r.phase === 'Succeeded'
                    ? 'RunSuccess'
                    : r.phase === 'Running'
                    ? 'Running'
                    : 'RunFailed'
            "
        />
        <div class="">
            <div
                class="text-base truncate overflow-ellipsis whitespace-nowrap"
                :class="{ 'font-bold': currRunName === r.name }"
            >
                <span>
                    {{ r.name }}
                </span>
                <a-spin
                    v-if="isLoading && currRunName === r.name"
                    class="ml-2"
                />
            </div>
            <div>
                <p class="tracking-wide text-gray-500">
                    <span v-if="r.phase !== 'Running'" class="mb-1 text-sm">
                        {{
                            timeDiffCalc(
                                new Date(r.started_at),
                                new Date(r.finished_at)
                            )
                        }}
                    </span>
                    <span v-if="r.phase !== 'Running'" class="text-gray-400">
                        &bull;
                    </span>
                    <span v-if="r.phase === 'Running'" class="mb-1 text-sm">
                        {{ timeAgo(r.started_at) }}</span
                    >
                    <span v-else class="mb-1 text-sm">
                        {{ timeAgo(r.finished_at) }}</span
                    >
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { timeDiffCalc } from '~/utils/date'

    export default defineComponent({
        name: 'RunCard',
        props: {
            r: {
                type: Object,
                required: true,
            },
            currRunName: {
                type: String,
                required: false,
                default: '',
            },
            isLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectEnabled: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['select'],
        setup(props, { emit }) {
            function timeAgo(time: number) {
                return useTimeAgo(time).value
            }
            return { emit, timeDiffCalc, timeAgo }
        },
    })
</script>

<style scoped></style>
