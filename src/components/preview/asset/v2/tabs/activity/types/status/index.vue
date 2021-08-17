<template>
    <b>Status</b> changed to
    <fa
        :icon="data.value.icon"
        :class="data.value.iconClass"
        class="mx-1 pushtop"
    ></fa
    ><b>{{ data.value.label }}</b>
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
