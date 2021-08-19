<template>
    <a-collapse
        class="p-0 m-0 text-gray-700 bg-transparent border-none"
        :bordered="false"
        expand-icon-position="right"
    >
        <a-collapse-panel class="border-none">
            <template #header
                ><span class="font-bold">Asset was updated</span></template
            >

            <div><b>Description</b> updated</div>
            <div>
                {{ data.value }}
            </div>
        </a-collapse-panel>
    </a-collapse>
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
