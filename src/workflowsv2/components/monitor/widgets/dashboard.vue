<template>
    <div class="grid grid-cols-12 gap-4">
        <WidgetComponent
            v-for="item in widgets"
            :id="item.id"
            :key="item.id"
            :data="item"
            :class="item.class"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { WidgetData } from '~/workflowsv2/constants/widgets'
    import WidgetComponent from './widget.vue'

    export default defineComponent({
        name: 'MonitorDashboard',
        components: { WidgetComponent },
        props: {
            widgets: {
                type: Array as PropType<WidgetData[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props, { emit }) {
            const { widgets } = toRefs(props)

            return { widgets }
        },
    })
</script>
