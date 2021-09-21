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
                        #title="{ title, type, key }"
                    >
                        <a-dropdown :trigger="['contextmenu']">
                            <div
                                class="min-w-full"
                            >
                                <div class="flex justify-between mr-2 group">
                                    <div class="flex m-0">
                                        <span
                                            class="
                                                my-auto
                                                text-sm
                                                leading-5
                                                text-gray-700
                                            "
                                            >{{ title }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </a-dropdown>
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
import { useRouter } from 'vue-router'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { useDebounceFn } from '@vueuse/core'

// components
import LoadingView from '@common/loaders/section.vue'
import Tooltip from '@/common/ellipsis/index.vue'

// import { Glossary } from '~/api/atlas/glossary'
import { Glossary } from '~/types/glossary/glossary.interface'

// composables

// constant
import { List as StatusList } from '~/constant/status'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
import AtlanBtn from '~/components/UI/button.vue'

// import { Glossary } from '~/api/atlas/glossary'

export default defineComponent({
    components: { LoadingView, AtlanIcon, AtlanBtn, Tooltip },
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