<template>
    <div class="w-full px-5">
        <Description :selected-row="selectedRow" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Description from './description.vue'

    export default defineComponent({
        name: 'ColumnDetails',
        components: {
            Description,
        },
        props: {
            selectedRow: {
                type: Object as PropType<any>,
                required: true,
            },
        },
    })
</script>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hover_bg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
</style>
