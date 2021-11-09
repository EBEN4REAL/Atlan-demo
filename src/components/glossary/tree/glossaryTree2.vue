<template>
    <a-tree
        :tree-data="list"
        :draggable="true"
        :block-node="true"
        :load-data="onLoadData"
        :loadedKeys="loadedKeys"
        :treeDataSimpleMode="true"
        :height="300"
        class="bg-transparent"
        :auto-expand-parent="false"
    >
        <template #switcherIcon>
            <AtlanIcon icon="CaretRight" class="my-auto" />
        </template>

        <template #title="entity">
            <GlossaryTreeItem2 :item="entity" />
        </template>
    </a-tree>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        computed,
        PropType,
        ref,
        toRef,
        toRefs,
        watch,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
    import { useDebounceFn } from '@vueuse/core'
    import { useVModels } from '@vueuse/core'

    import GlossaryTreeItem2 from '@/glossary/tree/glossaryTreeItem2.vue'

    // composables
    import useGtcSearch from '~/composables/glossary/useGtcSearch'

    import getEntityStatusIcon from '@/glossary/utils/getEntityStatusIcon'

    export default defineComponent({
        components: {
            GlossaryTreeItem2,
        },
        props: {
            list: {
                type: Array,
                required: false,
                default: () => [],
            },
            onLoadData: {
                type: Function,
                required: false,
                default: () => {},
            },
            loadedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props, { emit }) {
            const { list } = toRefs(props)

            return {
                list,
            }
            // data
        },
    })
</script>
<style lang="less" module></style>
