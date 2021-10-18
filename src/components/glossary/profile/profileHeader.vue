<template>
    <div
        class="flex items-center justify-between mx-4 mt-4 bg-white"
        :class="{ 'mb-5': headerReachedTop }"
    >
        <div class="flex items-center mr-5">
            <!-- breadcrumb -->
            <div v-if="headerReachedTop" class="flex items-center">
                <AtlanIcon icon="Glossary" class="h-5 m-0 mr-2" />
                <span
                    v-show="entity?.typeName !== 'AtlasGlossary'"
                    class="mr-1 text-sm cursor-pointer hover:underline"
                    @click="
                        redirectToProfile(
                            'AtlasGlossary',
                            entity?.attributes?.anchor?.guid
                        )
                    "
                >
                    {{ entity?.attributes?.anchor?.attributes?.name }}
                </span>
                <span v-show="entity?.typeName !== 'AtlasGlossary'" class="mx-1"
                    >/</span
                >
                <AtlanIcon
                    v-if="entity.typeName === 'AtlasGlossaryTerm'"
                    icon="Term"
                    class="h-5 m-0 mr-2"
                />
                <AtlanIcon
                    v-if="entity.typeName === 'AtlasGlossaryCategory'"
                    icon="Category"
                    class="h-5 m-0 mr-2"
                />
                <span class="max-w-sm mr-2 text-sm truncate overflow-ellipse">{{
                    title
                }}</span>
                <component
                    :is="statusObject?.icon"
                    v-if="statusObject"
                    class="inline-flex self-center w-auto h-4 mb-0.5"
                />
            </div>

            <div v-if="!headerReachedTop" class="flex items-center">
                <AtlanIcon
                    v-if="entity.typeName === 'AtlasGlossary'"
                    icon="Glossary"
                    class="h-5 m-0 mr-2"
                />
                <AtlanIcon
                    v-if="entity.typeName === 'AtlasGlossaryTerm'"
                    icon="Term"
                    class="h-5 m-0 mr-2"
                />
                <AtlanIcon
                    v-if="entity.typeName === 'AtlasGlossaryCategory'"
                    icon="Category"
                    class="h-5 m-0 mr-2"
                />

                <span class="mr-3 text-sm">{{
                    assetTypeLabel[entity.typeName].toUpperCase()
                }}</span>
                <div
                    v-if="
                        entity.typeName === 'AtlasGlossaryCategory' ||
                        entity.typeName === 'AtlasGlossaryTerm'
                    "
                    class="flex items-center"
                >
                    <div class="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <AtlanIcon icon="Glossary" class="h-4 m-0 mx-3 mb-0.5" />
                    <span
                        v-show="entity?.typeName !== 'AtlasGlossary'"
                        class="mr-1 text-sm text-gray-500 cursor-pointer  hover:underline"
                        @click="
                            redirectToProfile(
                                'AtlasGlossary',
                                entity?.attributes?.anchor?.guid
                            )
                        "
                    >
                        {{ entity?.attributes?.anchor?.attributes?.name }}
                    </span>
                </div>
            </div>
        </div>

        <div class="flex flex-row">
            <!--  hidden for GA -->
            <!-- <a-button
                class="flex items-center px-2 border-0 shadow-none outline-none"
                ><atlan-icon icon="BookmarkOutlined" class="w-auto h-4" />
                <span class="ml-2 text-sm">Bookmark</span>
            </a-button> -->
            <a-dropdown>
                <template #overlay>
                    <a-menu @click="handleMenuClick">
                        <a-menu-item key="1" @click="handleCopyProfileLink">
                            Copy link
                        </a-menu-item>
                        <!-- <a-menu-item key="2">
                            Share via other integration
                        </a-menu-item>
                        <a-menu-item key="3"> Share via slack </a-menu-item> -->
                    </a-menu>
                </template>
                <a-button
                    class="text-gray-500 border-transparent shadow-none  hover:border-gray-300 hover:shadow-sm"
                    ><div class="flex">
                        <AtlanIcon icon="Share" class="mt-0.5 mr-2" /> Share
                    </div></a-button
                >
            </a-dropdown>
            <ThreeDotMenu :entity="entity" :showLinks="false" />
        </div>
    </div>

    <div
        v-if="!headerReachedTop"
        class="flex flex-row justify-between pl-5 pr-5 mt-3 mb-4"
    >
        <div class="flex flex-row w-full">
            <div class="flex flex-col justify-center w-full">
                <div class="flex">
                    <span
                        v-if="!isNewEntity"
                        class="mr-2 text-xl leading-6 truncate"
                        >{{ title }}</span
                    >
                    <span
                        v-if="isNewEntity"
                        class="mr-2 text-xl italic leading-6 text-gray-500"
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
                            class="inline-flex self-center w-auto h-4 mb-0.5"
                        />
                    </a-popover>
                    <div v-else>
                        <component
                            :is="statusObject?.icon"
                            v-if="statusObject"
                            class="inline-flex self-center w-auto h-4 mb-0.5"
                        />
                    </div>
                </div>
                <div class="flex items-center mt-1">
                    <a-popover trigger="hover" placement="bottom">
                        <template #content>
                            <p class="w-60">{{ shortDescription }}</p>
                        </template>
                        <span
                            v-if="shortDescription !== ''"
                            class="text-sm leading-5 text-gray-500 truncate  overflow-ellipsis"
                            >{{ shortDescription }}</span
                        >
                    </a-popover>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, nextTick, watch } from 'vue'
    import { useRouter } from 'vue-router'

    // components
    import { message } from 'ant-design-vue'
    import ThreeDotMenu from '~/components/glossary/threeDotMenu/threeDotMenu.vue'
    // assets
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

    // utils
    import { copyToClipboard } from '~/utils/clipboard'
    import redirect from '@/glossary/utils/redirectToProfile'

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
            headerReachedTop: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const router = useRouter()
            // computed
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
            // methods
            const redirectToProfile = redirect(router)
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                if (props.entity?.typeName !== 'AtlasGlossary') {
                    const text = `${baseUrl}/glossary/${
                        assetTypeLabel[props.entity?.typeName]
                    }/${props?.entity?.guid}`
                    copyToClipboard(text)
                } else {
                    const text = `${baseUrl}/${
                        assetTypeLabel[props.entity?.typeName]
                    }/${props?.entity?.guid}`
                    copyToClipboard(text)
                }

                message.info({
                    content: 'Copied!',
                })
            }
            return {
                redirectToProfile,
                linkedAssetsCount,
                parentGlossaryName,
                assetTypeLabel,
                handleCopyProfileLink,
            }
        },
    })
</script>
