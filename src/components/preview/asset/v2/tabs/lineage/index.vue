<template>
    <div class="w-full">Lineage</div>
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

<style lang="less" scoped></style>
