<template>
    <div class="max-h-screen">
        <div class="h-full">
            <div
                v-if="treeData.length"
            >
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
                    <template
                        #title="item"
                    >
                        <a-popover v-if="item.title !== 'Load more'" placement="right">
                            <div
                                class="min-w-full"
                            >
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
                                                :icon="item.typeName"
                                                class="w-5 h-5 my-auto mr-1"
                                            ></AtlanIcon>
                                             <span class="text-sm leading-5 tracking-wide">{{ item.title }}</span>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <template v-if="item.key !== 'root'" class="p-4" #content>
                                <div class="flex flex-col max-w-80">
                                    <span class="m-0 mb-2 text-base leading-6 text-gray-700 font-bold">{{ item.title }}</span>
                                    <span class="m-0 text-sm leading-5 tracking-wide text-gray-500">{{ item.description }}</span>
                                    <span>{{item.ownerUsers}}</span>
                                    <span>{{item.ownerGroups}}</span>
                                </div>
                                <!-- <Classifications :selected-asset="item" /> -->
                                <!-- <div
                                    v-if="item.classifications?.length > 0"
                                    class="flex flex-wrap items-center w-56"
                                >
                                        <PillGroup
                                            :data="item.classifications"
                                            label-key="typeName"
                                            popover-trigger="hover"
                                        >
                                            <template #pillPrefix>
                                                <AtlanIcon
                                                    icon="Shield"
                                                    class="text-pink-400 group-hover:text-white"
                                                />
                                            </template>
                                            <template #popover="{ item }">
                                                <ClassificationInfoCard :classification="item" />
                                            </template>
                                            <template #suffix>
                                                <span
                                                    v-if="splittedOwners.b.length > 0"
                                                    class="
                                                        px-1
                                                        py-0.5
                                                        text-sm
                                                        rounded
                                                        text-primary
                                                        mr-3
                                                        cursor-pointer
                                                    "
                                                >
                                                    {{
                                                        showAll
                                                            ? 'Show less'
                                                            : `and ${splittedOwners.b.length} more`
                                                    }}
                                                </span>
                                            </template>
                                        </PillGroup>
                                    </div> -->
                            </template>
                        </a-popover>
                        <div v-else class="w-full text-sm leading-5 text-primary font-bold " @click="item.click()">
                            {{ item.title }}
                        </div>
                    </template>
                </a-tree>
            </div>
            <div
                v-else
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
                <p class="m-0 mt-20">The tree is empty,</p>
                <p class="m-0">Create a few terms!</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
// library
import {
    defineComponent,
    computed,
    PropType,
    ref,
    toRef,
    watch,
} from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

// components
import LoadingView from '@common/loaders/section.vue'
import Tooltip from '@/common/ellipsis/index.vue'
import PillGroup from '~/components/UI/pill/pillGroup.vue'
import OwnerInfoCard from '~/components/discovery/preview/hovercards/ownerInfo.vue'
import Avatar from '~/components/common/avatar.vue'
import Classifications from '@common/sidebar/classifications.vue'
import ClassificationInfoCard from '~/components/discovery/preview/hovercards/classificationInfo.vue'

// composables

// constant
import { List as StatusList } from '~/constant/status'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
import AtlanBtn from '~/components/UI/button.vue'
import { KeyMaps } from '~/api/keyMap'

// import { Glossary } from '~/api/atlas/glossary'

export default defineComponent({
    components: { LoadingView, AtlanIcon, AtlanBtn, Tooltip, PillGroup, OwnerInfoCard, Avatar,Classifications, ClassificationInfoCard },
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

        return {
            StatusList,
            // selectedKeys,
            // expandedKeys,
            // expandNode,
            // selectNode,
        }
    },
})
</script>