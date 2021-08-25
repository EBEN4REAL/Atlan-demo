<template>
    <div class="w-full px-5">
        <Terms :selected-row="selectedRow" />
        <Classifications :selected-row="selectedRow" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch } from 'vue'
    import Terms from './terms.vue'
    import Classifications from './classifications.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { Terms, Classifications },
        props: {
            selectedRow: {
                type: Object as PropType<any>,
                required: true,
            },
        },
        setup(props) {
            const { selectedRow } = toRefs(props)
            watch(
                selectedRow,
                () => {
                    console.log('column changed governance', selectedRow)
                },
                {
                    immediate: true,
                }
            )
        },
    })
</script>

<style lang="less" scoped></style>
