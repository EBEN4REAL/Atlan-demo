<template>
    <div v-if="data.value === ''" class="mb-0">
        <b>Description</b> was removed
    </div>
    <div v-else>
        <b>Description</b> was updated
        <div class="text-sm text-gray-500 whitespace-pre-wrap">
            {{ data.value }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        name: 'DescriptionActivity',

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
