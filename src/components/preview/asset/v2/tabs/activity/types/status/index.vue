<template>
    <b>Status</b> changed to
    <component
        :is="data.value.icon"
        class="inline-flex self-center w-auto h-4 mb-1"
    /><b>{{ ' ' }}{{ data.value.label }}</b>
    <div class="flex my-2">
        <div class="w-1 ml-2 mr-4 bg-gray-500 rounded min-h-6"></div>
        <div class="text-xs">
            <span class="text-gray-500">Status</span>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                venenatis.
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
