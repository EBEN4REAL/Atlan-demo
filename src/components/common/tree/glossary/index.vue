<template>
    <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:value="selectedKeys"
        :tree-data="treeData"
        :load-data="onLoadData"
        :block-node="true"
        @select="selectNode"
        @expand="expandNode"
    >
        <template #title="{ title, type, key }">
            <a-dropdown :trigger="['contextmenu']">
                <div
                    class="min-w-full"
                    @click="() => reirectToProfile(type, key)"
                >
                    <div class="flex align-middle">
                        <span class="mr-1">
                            <img
                                v-if="type === 'glossary'"
                                :src="GlossarySvg"
                                :width="15"
                            />
                            <img
                                v-if="type === 'category'"
                                :src="CategorySvg"
                                :width="15"
                            />
                            <img
                                v-if="type === 'term'"
                                :src="TermSvg"
                                :width="12"
                            />
                        </span>
                        <span class="text-sm leading-none text-gray-600">{{
                            title
                        }}</span>
                    </div>
                </div>
                <template #overlay>
                    <GlossaryContextMenu
                        :type="type"
                        :guid="key"
                        @glossarContextMenuClick="glossaryTreeContextMenuClick"
                    />
                </template>
            </a-dropdown>
        </template>
    </a-tree>
    <a-dropdown :trigger="['contextmenu']">
        <div class="root"></div>
        <template #overlay>
            <GlossaryContextMenu
                type="root"
                guid=""
                @glossarContextMenuClick="glossaryTreeContextMenuClick"
            />
        </template>
    </a-dropdown>
</template>

<script lang="ts">
import data from 'emoji-mart-vue-fast/data/facebook.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Emoji, EmojiIndex } from 'emoji-mart-vue-fast/src'
import { Modal } from 'ant-design-vue'

import { defineComponent, watch } from 'vue'
import { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'
import { useRouter } from 'vue-router'
import fetchGlossaryList from '~/composables/glossary/fetchGlossaryList'
import useGlossaryTree from '~/composables/glossary/useGlossaryTree'
import handleTreeExpand from '~/composables/tree/handleTreeExpand'
import { Glossary } from '~/api/atlas/glossary'
import GlossaryContextMenu from './glossaryContextMenu.vue'
import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'
import CategorySvg from '~/assets/images/gtc/category/category.png'
import TermSvg from '~/assets/images/gtc/term/term.png'


export default defineComponent({
    components: { Emoji, GlossaryContextMenu },
    props: {
        searchText: {
            type: String,
            required: false,
            default() {
                return ''
            },
        },
    },
    emits: ['showCreateGlossaryModal', 'showUpdateGlossaryModal', 'success'],

    setup(props, { emit }) {
        const router = useRouter()

        

        const { list, totalCount, listCount, refetchGlossary, response } =
            fetchGlossaryList()
        const { selectedKeys, expandedKeys, expandNode, selectNode } =
            handleTreeExpand(emit)

        const index = new EmojiIndex(data)

        const { treeData, onLoadData } = useGlossaryTree(list)
        console.log(treeData, 'treeData')

        const refreshTree = () => {
            refetchGlossary()
        }

        const glossaryTreeContextMenuClick = (context: any) => {
            if (context.action === 'create')
                emit('showCreateGlossaryModal', context)
            if (context.action === 'update')
                emit('showUpdateGlossaryModal', context)
            if (context.action === 'delete') {
                Modal.confirm({
                    title: `Are you sure delete this ${context.parentType}?`,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk() {
                        const serviceMap: Record<
                            string,
                            | 'DeleteGlossary'
                            | 'DeleteGlossaryCategory'
                            | 'DeleteGlossaryTerm'
                        > = {
                            glossary: 'DeleteGlossary',
                            category: 'DeleteGlossaryCategory',
                            term: 'DeleteGlossaryTerm',
                        }
                        const service = serviceMap[context.parentType]
                        Glossary[service](context.parentGuid)

                        setTimeout(() => {
                            refreshTree()
                        }, 1000)
                    },
                })
            }
        }

        const reirectToProfile = (type: string, guid: string) => {
            if (type === 'glossary') router.push(`/glossary/${guid}`)
            else router.push(`/glossary/${type}/${guid}`)
        }

        return {
            index,
            list,
            response,
            treeData,
            listCount,
            totalCount,
            onLoadData,
            selectedKeys,
            expandedKeys,
            expandNode,
            selectNode,
            refreshTree,
            glossaryTreeContextMenuClick,
            reirectToProfile,
            GlossarySvg,
            CategorySvg,
            TermSvg,
        }
    },
    data() {
        return {}
    },
})
</script>
<style lang="less" scoped>
.root {
    min-height: 50vh;
}
</style>
