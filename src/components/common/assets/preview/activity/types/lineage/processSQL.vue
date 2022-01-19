<template>
    <div>
        <span> <b> Query</b> was updated </span>
        <SQLSnippet
            class="mx-4 rounded-lg"
            :text="data.value"
            background="bg-primary-light"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import SQLSnippet from '@/common/sql/snippet.vue'

    export default defineComponent({
        name: 'ProcessSQLActivity',
        components: { SQLSnippet },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup() {
            return {}
        },
    })
</script>
