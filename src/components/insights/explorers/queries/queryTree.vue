<template>
    <div class="max-h-screen">
        <div class="h-full">
            <div v-if="treeData.length">
                <a-tree
                    :expandedKeys="expandedKeys"
                    :selectedKeys="selectedKeys"
                    :loadedKeys="loadedKeys"
                    :tree-data="treeData"
                    :load-data="onLoadData"
                    :draggable="false"
                    :block-node="true"
                    :auto-expand-parent="false"
                    @select="selectNode"
                    @expand="expandNode"
                >
                    <template #title="item">
                        <div
                            v-if="item.title !== 'Load more'"
                        >
                            <div class="min-w-full">
                                <div class="flex justify-between mr-2 group">
                                    <div class="flex m-0">
                                        <div
                                            class="
                                                my-auto
                                                flex
                                                content-center
                                                text-sm
                                                leading-5
                                                text-gray-700
                                            "
                                        >
                                            <AtlanIcon
                                                v-if="item.typeName === 'QueryFolder' "
                                                :icon="expandedKeys.find(key => key === item.key) ? 'FolderOpen' : 'FolderClosed'"
                                                class="w-5 h-5 my-auto mr-1"
                                            ></AtlanIcon>
                                            {{ item.isOpen }}
                                            <span
                                                class="
                                                    text-sm
                                                    leading-5
                                                    tracking-wide
                                                "
                                                >{{ item.title }}</span
                                            >
                                            <StatusBadge
                                                :key="item.guid"        
                                                :show-no-status="false"
                                                :status-id="item.entity?.attributes?.assetStatus"
                                                class="flex-none ml-1"
                                            ></StatusBadge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            class="
                                w-full
                                text-sm
                                leading-5
                                text-primary
                                font-bold
                                flex
                                flex-row
                            "
                            @click="item.click()"
                        >
                            <span v-if="item.isLoading">
                                <LoadingView size="small" class="h-1 w-1 mr-4" />
                            </span>
                             <span v-else>{{ item.title }}</span>
                        </div>
                    </template>
                </a-tree>
            </div>
            <div v-else-if="isLoading">
                <LoadingView />
            </div>
            <div
                v-else-if="!treeData.length"
                class="
                    flex flex-col
                    justify-center
                    text-base
                    leading-6
                    text-center text-gray-500
                    mt-14
                "
            >
                <AtlanIcon icon="EmptyGlossary" class="h-40" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
// library
import { defineComponent, PropType, inject, Ref } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

// components
import LoadingView from '@common/loaders/section.vue'
import StatusBadge from '@common/badge/status/index.vue'

// composables
import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'

// constant
import { List as StatusList } from '~/constant/status'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
import AtlanBtn from '~/components/UI/button.vue'

// import { Glossary } from '~/api/atlas/glossary'

export default defineComponent({
    components: {
        LoadingView,
        AtlanIcon,
        AtlanBtn,
        StatusBadge,
    },
    props: {
        treeData: {
            type: Object as PropType<TreeDataItem[]>,
            required: true,
            default: () => {},
        },
        onLoadData: {
            type: Function,
            required: false,
            default: () => {},
        },
        expandNode: {
            type: Function,
            required: false,
            default: () => {},
        },
        selectNode: {
            type: Function,
            required: false,
            default: () => {},
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
        loadedKeys: {
            type: Array as PropType<string[]>,
            required: true,
            default: () => [],
        },
        selectedKeys: {
            type: Array as PropType<string[]>,
            required: true,
            default: () => [],
        },
        expandedKeys: {
            type: Array as PropType<string[]>,
            required: true,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        // data
        const inlineTabs = inject('inlineTabs') as Ref<
            activeInlineTabInterface[]
        >
        const activeInlineTab = inject(
            'activeInlineTab'
        ) as Ref<activeInlineTabInterface>
        const activeInlineTabKey = inject(
            'activeInlineTabKey'
        ) as Ref<string>

        const { openSavedQueryInNewTab } = useSavedQuery(
            inlineTabs,
            activeInlineTab,
            activeInlineTabKey,
        )
        const isSavedQueryOpened = (savedQuery: SavedQueryInterface) => {
            let bool = false
            inlineTabs.value.forEach((tab) => {
                if (tab.key === savedQuery.id) bool = true
            })
            return bool
        }

        return {
            StatusList,
            isSavedQueryOpened,
            openSavedQueryInNewTab,

            // selectedKeys,
            // expandedKeys,
            // expandNode,
            // selectNode,
        }
    },
})
</script>