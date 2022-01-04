<template>
    <div style="width: min-content !important">
        <RaisedTab v-model:active="filterType" :data="tabConfig" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRaw } from 'vue'
    import { useVModels } from '@vueuse/core'
    import RaisedTab from '@/UI/raisedTab.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            RaisedTab,
        },
        props: {
            filterType: {
                type: String,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { filterType } = useVModels(props)
            const tabConfig = ref([
                { key: 'and', label: 'AND' },
                { key: 'or', label: 'OR' },
            ])

            return {
                tabConfig,
                filterType,
            }
        },
    })
</script>
<style lang="less" scoped></style>
