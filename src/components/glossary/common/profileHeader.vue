<template>
    <div class="flex items-center justify-between mx-4 mt-3">
        <div class="flex items-center mr-5">
            <a-button
                class="flex items-center p-0 m-0 border-0 shadow-none outline-none "
                @click="redirectToProfile"
            >
                <AtlanIcon
                    class="w-auto h-5 mr-3"
                    icon="ArrowRight"
                    style="transform: scaleX(-1)"
                />
            </a-button>
            <AtlanIcon icon="Glossary" class="h-5 m-0 mr-2" />
            <span
                class="mr-1 text-sm"
                v-show="entity?.typeName !== 'AtlasGlossary'"
            >
                {{
                    entity?.attributes?.anchor?.uniqueAttributes?.qualifiedName
                }}
                /</span
            >
            <AtlanIcon
                v-if="entity.typeName === 'AtlasGlossaryTerm'"
                icon="Term"
                class="h-5 m-0 mr-2"
            />
            <AtlanIcon
                v-if="entity.typeName === 'AtlasGlossaryCategory'"
                icon="Category"
                class="h-5 m-0 mb-1 mr-2"
            />

            <span class="mr-3 text-sm">{{ title }}</span>
        </div>

        <div class="flex flex-row">
            <a-button
                class="flex items-center px-2 border-0 shadow-none outline-none"
                ><atlan-icon icon="BookmarkOutlined" class="w-auto h-4" />
                <span class="ml-2 text-sm">Bookmark</span>
            </a-button>

            <a-button
                class="flex items-center border-0 shadow-none outline-none"
                ><atlan-icon icon="Share" class="w-auto h-4 mr-1" />
                <span class="text-sm">Share</span>
            </a-button>

            <ThreeDotMenu :entity="entity" :showLinks="false" />
        </div>
    </div>

    <div class="flex flex-row justify-between pl-5 pr-5 mt-5 mb-5">
        <div class="flex flex-row w-full">
            <div class="flex flex-col justify-center w-full">
                <div class="flex">
                    <span
                        v-if="!isNewEntity"
                        class="mr-3 text-xl font-bold leading-6"
                        >{{ title }}</span
                    >

                    <span
                        v-if="isNewEntity"
                        class="mr-3 text-xl italic leading-6 text-gray-500"
                        >Untitled {{ assetTypeLabel[entity.typeName] }}
                    </span>
                    <a-popover
                        v-if="statusMessage"
                        trigger="hover"
                        placement="rightTop"
                    >
                        <template #content>
                            <p>{{ statusMessage }}</p>
                        </template>
                        <component
                            :is="statusObject?.icon"
                            v-if="statusObject"
                            class="inline-flex self-center w-auto h-4 mb-1"
                        />
                    </a-popover>
                    <div v-else>
                        <component
                            :is="statusObject?.icon"
                            v-if="statusObject"
                            class="inline-flex self-center w-auto h-4 mb-1"
                        />
                    </div>
                </div>
                <div class="flex items-center mt-1">
                    <span class="mr-4 text-sm leading-5 text-gray-500">{{
                        assetTypeLabel[entity.typeName].toUpperCase()
                    }}</span>

                    <span
                        class="text-sm leading-5 text-gray-500 truncate  overflow-ellipsis"
                        v-if="shortDescription !== ''"
                        >{{ shortDescription }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { useRouter } from 'vue-router'

    // components
    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'
    // assets
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

    export default defineComponent({
        components: {
            ThreeDotMenu,
        },
        props: {
            title: {
                type: String,
                required: true,
                default: '',
            },
            statusMessage: {
                type: String,
                required: true,
                default: '',
            },
            shortDescription: {
                type: String,
                required: true,
                default: '',
            },
            isNewEntity: {
                type: Boolean,
                required: false,
                default: false,
            },

            statusObject: {
                type: Object,
                required: true,
                default: () => {},
            },
            entity: {
                type: Object,
                required: true,
                default: () => {},
            },
        },
        setup(props) {
            // const assetTypeLabel = {
            //     AtlasGlossaryTerm: 'term',
            //     AtlasGlossaryCategory: 'category',
            //     AtlasGlossary: 'glossary',
            // }
            const router = useRouter()

            const parentGlossaryName = computed(
                () =>
                    props.entity.value?.attributes?.qualifiedName?.split(
                        '@'
                    )[1] ?? ''
            )

            const linkedAssetsCount = computed(
                () =>
                    props.entity.value?.attributes?.assignedEntities?.length ??
                    0
            )

            const redirectToProfile = () => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    router.push('/glossary')
                else
                    router.push(
                        `/glossary/${props.entity?.attributes?.anchor?.guid}`
                    )
            }
            return {
                redirectToProfile,
                linkedAssetsCount,
                parentGlossaryName,
                assetTypeLabel,
            }
        },
    })
</script>
