<template>
    <div>
        <!-- @shubhankar ... get ideas from
        -- /src/components/common/assets/preview/drawer.vue
        -- /src/components/common/assets/preview/relations/index.vue -->
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'GroupProcessesDrawer',
        props: {
            groupedProcessIds: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
    })
</script>
