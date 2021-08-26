<template>
    <div v-if="isHome" class="px-2 py-4">
        <div class="px-2 pb-2">
            <a-input-search
                placeholder="Search accross Glossaries"
            ></a-input-search>
        </div>
        <div v-for="glossary in glossaryList" :key="glossary.guid" @click="() => redirectToProfile(glossary.guid)">
            <div
                class="
                    px-3
                    text-sm
                    leading-5
                    text-gray-700
                    h-9
                    flex flex-col
                    justify-center
                    cursor-pointer
                    group
                    hover:bg-primary-light
                    hover:text-primary
                "
            >
                <div class="flex flex-row justify-between">
                    {{ glossary.displayText }}
                    <Fa
                        class="w-auto h-3 text-white group-hover:text-primary"
                        icon="fal external-link-alt"
                    />
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div
            class="flex py-2 pl-4 mb-4 text-sm leading-5 text-gray-500 bg-gray-100 cursor-pointer "
            type="link"
            @click="backToHome"
        >
            <fa icon="fas chevron-left" class="mr-2" />
            <span>Back to Glossary Home</span>
        </div>
        <div class="px-4 pb-4">
            <a-input-search
                placeholder="Search accross Glossaries"
            ></a-input-search>
        </div>
        <div class="flex px-4 space-x-2">
            <a-button
                class="w-full text-sm font-bold leading-5 border-none  bg-primary-light text-primary"
            >
                <!-- <span v-if="entity?.typeName === 'AtlasGlossary'">
                    {{ entity?.displayText }}
                </span>
                <span v-else>{{
                    entity?.attributes?.anchor?.uniqueAttributes
                        ?.qualifiedName
                }}</span> -->
            </a-button>
            <a-button
                class="
                    p-2
                    px-2.5
                    flex flex-col
                    justify-center
                    bg-primary-light
                    text-primary
                    border-none
                "
            >
                <fa icon="fal plus" />
            </a-button>
        </div>
        <div class="py-2 px-2.5">
                <a-tree
                    v-model:expandedKeys="expandedKeys"
                    v-model:value="selectedKeys"
                    :tree-data="treeData"
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
                                <div class="flex content-center">
                                    <span class="mr-2 p-0">
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
                                    <span class="text-sm leading-5 text-gray-700">{{
                                        title
                                    }}</span>
                                </div>
                            </div>
                        </a-dropdown>
                    </template>
                </a-tree>
        </div>
    </div>
</template>
<script lang="ts">
// library
import { defineComponent, computed, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';

// import { Glossary } from '~/api/atlas/glossary'
import { Glossary } from "~/types/glossary/glossary.interface";

// composables
import handleTreeExpand from '~/composables/tree/handleTreeExpand'

// constant
import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'
import CategorySvg from '~/assets/images/gtc/category/category.png'
import TermSvg from '~/assets/images/gtc/term/term.png'

export default defineComponent({
    props: {
        glossaryList: {
            type: Object as PropType<Glossary[]>,
            required: true,
            default: () => []
        },
        isHome: {
            type: Boolean,
            required: true,
            default: true
        },
        treeData: {
            type: Object as PropType<TreeDataItem[]>,
            required: true,
            default: () => {}
        }
    },
    setup(props, { emit }) {
        // data
        // const { data: glossaryList, loading, error, mutate } = Glossary.List()

        const { selectedKeys, expandedKeys, expandNode, selectNode } =
            handleTreeExpand(emit)

        const router = useRouter()

        // computed


        // methods
        const redirectToProfile = (guid: string) => {
            router.push(`/glossary/${guid}`)
        }
        const backToHome = () => router.push('/glossary')


        return {
            redirectToProfile,
            backToHome,
            GlossarySvg,
            CategorySvg,
            TermSvg,
            selectedKeys, 
            expandedKeys, 
            expandNode, 
            selectNode
        }
    },
})
</script>
