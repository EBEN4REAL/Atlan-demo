<template>
    <div class="mb-3">
        <b>Status</b> changed to
        <component
            :is="data.value.icon"
            class="inline-flex self-center w-auto h-4 mb-1"
        /><b>{{ ' ' }}{{ data.value.label }}</b>
    </div>
    <div v-if="data.value.description" class="flex mb-3">
        <div class="w-1.5 ml-2 mr-4 bg-gray-500 rounded-full min-h-6"></div>
        <div class="my-0.5 text-sm">
            <div class="text-xs text-gray-500">Status Message</div>
            <div>
                {{ data.value.description }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
    })
</script>
