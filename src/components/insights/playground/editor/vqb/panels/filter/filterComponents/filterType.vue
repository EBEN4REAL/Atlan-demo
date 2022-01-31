<template>
    <div style="width: min-content !important">
        <RaisedTab
            v-model:active="filterType"
            :disabled="disabled"
            :data="tabConfig"
            variant="small"
        />
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
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
        },

        setup(props, { emit }) {
            const { filterType, disabled } = useVModels(props)
            const activeInlineTab = inject(
                'activeInlineTab'
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
                updateVQB(activeInlineTab, inlineTabs)
            })

            return {
                disabled,
                tabConfig,
                filterType,
            }
        },
    })
</script>
<style lang="less" scoped></style>
