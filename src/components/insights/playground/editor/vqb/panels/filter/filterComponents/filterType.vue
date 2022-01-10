<template>
    <div style="width: min-content !important">
        <RaisedTab v-model:active="filterType" :data="tabConfig" />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        PropType,
        toRa,
        ComputedRef,
        inject,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import RaisedTab from '@/UI/raisedTab.vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

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
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>

            const { updateVQB } = useVQB()

            const tabConfig = ref([
                { key: 'and', label: 'AND' },
                { key: 'or', label: 'OR' },
            ])

            watch(filterType, () => {
                updateVQB(activeInlineTabKey, inlineTabs)
            })

            return {
                tabConfig,
                filterType,
            }
        },
    })
</script>
<style lang="less" scoped></style>
