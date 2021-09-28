<template>
    <span v-if="data?.displayValue.includes('classification')">
        <classifications :data="data" />
    </span>
    <span v-if="data?.displayValue.includes('term')">
        <terms :data="data" />
    </span>
    <span v-if="data?.displayValue === 'owners'">
        <owners :data="data" />
    </span>
    <span v-if="data?.displayValue === 'status'">
        <status :data="data" />
    </span>
    <span v-if="data?.displayValue === 'experts'">
        <experts :data="data" />
    </span>
    <span v-if="data?.displayValue === 'description'">
        <description :data="data" />
    </span>
    <span v-if="data?.displayValue === 'bmUpdated'">
        <business-metadata :data="data" />
    </span>
    <!--  <span v-else>
        {{ data?.displayValue }}
    </span> -->
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import Status from './types/status/index.vue'
    import Classifications from './types/classifications/index.vue'
    import Description from './types/description/index.vue'
    import Terms from './types/terms/index.vue'
    import Experts from './types/experts/index.vue'
    import Owners from './types/owners/index.vue'
    import BusinessMetadata from './types/businessMetadata/index.vue'

    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        components: {
            Status,
            Classifications,
            Description,
            Terms,
            Experts,
            Owners,
            BusinessMetadata,
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: 'Event', value: [] }
                },
            },
        },
    })
</script>
