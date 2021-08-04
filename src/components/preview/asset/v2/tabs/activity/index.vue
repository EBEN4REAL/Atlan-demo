<template>
    <div class="w-full">Activity</div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    export default defineComponent({
        components: {},
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
        },
        setup(props) {
            return {}
        },
    })
</script>

<style lang="less" scoped>
    .view {
        border: 3px solid white;
        margin-left: -8px;
    }
</style>
