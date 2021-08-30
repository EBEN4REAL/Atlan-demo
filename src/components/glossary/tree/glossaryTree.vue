<template>
    <div v-if="isHome" class="px-2 py-4">
        <div class="px-2 pb-2">
            <a-input-search
                placeholder="Search accross Glossaries"
            ></a-input-search>
        </div>
        <div
            v-for="glossary in glossaryList"
            :key="glossary.guid"
            @click="() => redirectToProfile('glossary', glossary.guid)"
        >
            <div
                class="flex flex-col justify-center px-3 text-sm leading-5 text-gray-700 cursor-pointer  h-9 group hover:bg-primary-light hover:text-primary"
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
        <div v-if="!isLoading">
            <div class="flex pr-4 space-x-2">
                <div
                    class="flex justify-start w-full pl-6 text-base leading-5 cursor-pointer "
                    @click="redirectToProfile('glossary', parentGlossary.guid)"
                >
                    <span
                        class="flex my-auto"
                        :class="{
                            'text-primary':
                                currentGuid === parentGlossary?.guid,
                        }"
                    >
                        {{
                            parentGlossary?.displayText ??
                            parentGlossary?.uniqueAttributes?.qualifiedName
                        }}
                    </span>
                </div>
                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click.prevent>
                        <a-button
                            class="flex flex-col justify-center p-2 border-none  bg-primary-light text-primary"
                        >
                            <fa icon="fal plus" />
                        </a-button>
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0"> New term </a-menu-item>
                            <a-menu-item key="1"> New category </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <div class="py-2 pl-6">
                <a-tree
                    v-model:expandedKeys="expandedKeys"
                    v-model:value="selectedKeys"
                    :tree-data="treeData"
                    :load-data="onLoadData"
                    :block-node="true"
                    :auto-expand-parent="false"
                    @select="selectNode"
                    @expand="expandNode"
                >
                    <template #title="{ title, type, key }">
                        <a-dropdown :trigger="['contextmenu']">
                            <div
                                class="min-w-full"
                                @click="() => redirectToProfile(type, key)"
                            >
                                <div class="flex content-center">
                                    <span class="p-0 mr-2">
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
                                    <span
                                        class="text-sm leading-5 text-gray-700"
                                        >{{ title }}</span
                                    >
                                </div>
                            </div>
                        </a-dropdown>
                    </template>
                </a-tree>
            </div>
        </div>
        <div v-else class="mt-4">
            <LoadingView />
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, computed, PropType, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

    // components
    import LoadingView from '@common/loaders/section.vue'

    // import { Glossary } from '~/api/atlas/glossary'
    import { Glossary } from '~/types/glossary/glossary.interface'

    // composables
    import handleTreeExpand from '~/composables/tree/handleTreeExpand'

    // constant
    import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'
    import CategorySvg from '~/assets/images/gtc/category/category.png'
    import TermSvg from '~/assets/images/gtc/term/term.png'
    import { Glossary } from '~/api/atlas/glossary'

    export default defineComponent({
        components: { LoadingView },
        props: {
            glossaryList: {
                type: Object as PropType<Glossary[]>,
                required: true,
                default: () => [],
            },
            isHome: {
                type: Boolean,
                required: true,
                default: true,
            },
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
            parentGlossary: {
                type: Object as PropType<Glossary>,
                required: false,
                default: () => {},
            },
            isLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
            currentGuid: {
                type: String,
                required: true,
                default: '',
            },
        },
        setup(props, { emit }) {
            // data
            // const { data: glossaryList, loading, error, mutate } = Glossary.List()

            const { selectedKeys, expandedKeys, expandNode, selectNode } =
                handleTreeExpand(emit)

            const router = useRouter()

            // computed

            // methods
            const redirectToProfile = (type: string, guid: string) => {
                if (type === 'glossary') router.push(`/glossary/${guid}`)
                else router.push(`/glossary/${type}/${guid}`)
            }
            const backToHome = () => router.push('/glossary')

            const handleSubmit = () => {
                const { data, error, isLoading } = Glossary.CreateGlossaryTerm(
                    body.value,
                    body
                )

                watch(
                    [data, error, isLoading],
                    ([newData, newError, newLoading]) => {
                        entity.value = newData
                        error.value = newError
                        isLoading.value = newLoading

                        name.value = ''
                        description.value = ''
                    }
                )
            }

            return {
                redirectToProfile,
                backToHome,
                GlossarySvg,
                CategorySvg,
                TermSvg,
                selectedKeys,
                expandedKeys,
                expandNode,
                selectNode,
            }
        },
    })
</script>
