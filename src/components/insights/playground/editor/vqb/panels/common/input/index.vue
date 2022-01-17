<template>
    <a-input
        ref="searchBar"
        v-model:value="queryText"
        class="border rounded light-bg child_input"
        :placeholder="placeholder"
        :class="$style.custom_input_style"
        style="z-index: 10 !important"
    >
        <template #prefix>
            <AtlanIcon icon="Search" class="flex-none pr-1 text-gray-500" />
        </template>
    </a-input>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        nextTick,
        onMounted,
        Ref,
        ref,
        toRefs,
        PropType,
    } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'SearchAndFilter',
        props: {
            autofocus: { type: Boolean, default: () => false },
            dot: { type: Boolean, default: () => false },
            placeholder: { type: String, default: () => 'Search' },
            size: {
                type: String as PropType<'default' | 'minimal' | 'bordered'>,
                default: () => 'default',
            },
            queryText: { type: String },
        },
        emits: ['update:value', 'change'],
        setup(props, { emit }) {
            const { autofocus } = toRefs(props)
            const { queryText } = useVModels(props)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)

            onMounted(async () => {
                if (autofocus.value) {
                    await nextTick()
                    searchBar.value?.focus()
                }
            })

            return {
                queryText,
                searchBar,
            }
        },
    })
</script>
<style lang="less" module>
    .custom_input_style {
        :global(.ant-input) {
            background-color: rgba(250, 250, 250, var(40));
        }
    }
</style>
<style lang="less" scoped>
    .light-bg {
        background-color: rgba(250, 250, 250, var(40));
    }
</style>
