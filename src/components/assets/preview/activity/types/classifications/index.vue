<template>
    <div>
        <b>Classification </b
        >{{ data.displayValue === 'classificationAdded' ? 'added' : 'removed' }}
    </div>
    <div class="my-3">
        <Pill :label="data.value"
            ><template #prefix>
                <AtlanIcon
                    icon="Shield"
                    class="text-pink-400 group-hover:text-white" /></template
        ></Pill>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import Pill from '~/components/UI/pill/pill.vue'

    export default defineComponent({
        components: { Pill },
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
