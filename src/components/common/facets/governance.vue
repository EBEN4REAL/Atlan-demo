<template>
    <div class="pb-6">
        <div v-if="isInitingTree">
            <LoadingView size="small" class="w-1 h-1 mt-4 mr-4" />
        </div>
        <div
            v-else
            class="overflow-y-auto max-h-64"
            :class="$style.filterTree"
        >
            <a-tree
                :expandedKeys="expandedKeys"
                :selectedKeys="selectedKeys"
                :loadedKeys="loadedKeys"
                :tree-data="treeData"
                :load-data="onLoadData"
                :block-node="true"
                :auto-expand-parent="false"
                @select="selectNode"
                @expand="expandNode"
                class="h-full"
                :checkable="true"
                :checkStrictly="true"
                @check="onCheck"
            >
                <template #title="entity">
                    <div
                        v-if="entity.title === 'Load more'"
                        class="flex flex-row w-full text-sm font-bold leading-5  text-primary"
                        @click="entity.click()"
                    >
                        <span v-if="entity.isLoading">
                            <LoadingView size="small" class="w-1 h-1 mr-4" />
                        </span>
                        <span v-else>{{ entity.title }}</span>
                    </div>
                    <div v-else>
                        <div class="min-w-full">
                            <div class="flex justify-between mr-2 group">
                                <div class="flex pb-1 m-0">
                                    <span
                                        v-if="entity.type === 'glossary'"
                                        class="p-0 my-auto mr-2"
                                    >
                                        <AtlanIcon
                                            icon="Glossary"
                                            class="h-5"
                                        />
                                    </span>
                                    <span v-else class="p-0 my-auto mr-1.5">
                                        <AtlanIcon
                                            :icon="
                                                getEntityStatusIcon(
                                                    entity.type,
                                                    entity.assetStatus
                                                )
                                            "
                                        />
                                    </span>
                                    <span
                                        class="my-auto text-sm leading-5 text-gray-700 "
                                    >
                                        {{ entity.title }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </a-tree>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { Components } from '~/api/atlas/client'
    import { List } from '~/constant/status'
    import { Collapse } from '~/types'
    import useTree from '~/components/glossary/tree/composables/useTree'

    import LoadingView from '@common/loaders/section.vue'
    import getEntityStatusIcon from '~/components/glossary/tree/utils/getIcon'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        components: { LoadingView },
        emits: ['change'],
        setup(props, { emit }) {
            const list = computed(() => List)
            const { data } = toRefs(props)
            const onCheck = (_, { checkedNodes }) => {
                if (checkedNodes.length) {
                    emit('change', checkedNodes[0].props.qualifiedName)
                } else {
                    emit('change', undefined)
                }
            }

            const {
                treeData,
                loadedKeys,
                onLoadData,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                expandNode,
                selectNode,
                reInitTree,
                collapseAll,
            } = useTree(
                emit,
                true,
                computed(() => false),
                true
            )

            return {
                data,
                list,

                getEntityStatusIcon,
                onCheck,
                treeData,
                loadedKeys,
                onLoadData,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                expandNode,
                selectNode,
                reInitTree,
                collapseAll,
            }
        },
    })
</script>
<style lang="less" module>
    .status:last-child {
        margin-bottom: 0 !important;
    }

    .filterTree {
        :global(.ant-tree-checkbox) {
            @apply mt-1 !important;
        }
    }
</style>
