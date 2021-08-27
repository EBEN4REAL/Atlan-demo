<template>
    <div>
        <a-dropdown :trigger="['click']">
            <a-button class="px-2.5" @click.prevent>
                <fa icon="fal ellipsis-v" class="h-4" />
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item v-if="showLinks" @click="redirectToProfile">
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">
                                Go to
                                {{ assetTypeLabel[entity.typeName] }}
                                profile
                            </p>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        v-if="showLinks"
                        class="flex items-center"
                        @click="handleCopyProfileLink"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="CopyOutlined" class="m-0 mr-2" />
                            <p class="p-0 m-0">
                                Copy
                                {{ assetTypeLabel[entity.typeName] }}
                                profile link
                            </p>
                        </div>
                    </a-menu-item>

                    <a-menu-divider v-if="showLinks" />
                    <a-menu-item
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                        class="flex items-center"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">Add term</p>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                        class="flex items-center"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">Add category</p>
                        </div>
                    </a-menu-item>

                    <a-menu-divider
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                    />
                    <a-sub-menu key="status">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <StatusBadge
                                    :key="entity.guid"
                                    :status-id="entity?.attributes?.assetStatus"
                                    :status-message="
                                        entity?.attributes?.assetStatusMessage
                                    "
                                    :show-chip-style-status="false"
                                    :show-no-status="true"
                                    :show-label="true"
                                    class="p-0"
                                ></StatusBadge>
                                <AtlanIcon
                                    class="pt-1 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <a-menu-item class="m-0 bg-white">
                            <Status
                                v-if="entity.guid"
                                :selectedAsset="entity"
                            />
                        </a-menu-item>
                    </a-sub-menu>

                    <a-sub-menu key="expert">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center justify-between">
                                    <AtlanIcon
                                        icon="AddUser"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Add Owner</p>
                                </div>
                                <AtlanIcon
                                    class="pt-1 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <a-menu-item class="m-0 bg-white">
                            <Owners :selectedAsset="entity"
                        /></a-menu-item>
                    </a-sub-menu>
                    <a-menu-divider />
                    <a-menu-item class="text-red-700">
                        <div class="flex items-center">
                            <fa icon="fal trash-alt" class="mr-2"></fa>
                            <p class="p-0 m-0">Archive</p>
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'
    // components
    // import Status from '@/discovery/preview/tabs/info/assetDetails/status.vue'
    import Owners from '@/glossary/common/owners.vue'
    import Status from '@/glossary/common/status.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { copyToClipboard } from '~/utils/clipboard'

    export default defineComponent({
        components: { Status, Owners, StatusBadge },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            redirectToProfile: {
                type: Function,
                required: false,
                default: undefined,
            },
            showLinks: {
                type: Boolean,
                required: false,
                default: () => true,
            },
        },
        setup(props) {
            const assetTypeLabel = {
                AtlasGlossaryTerm: 'term',
                AtlasGlossaryCategory: 'category',
                AtlasGlossary: 'glossary',
            }
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/glossary/${
                    assetTypeLabel[props.entity.typeName]
                }/${props?.entity?.guid}`
                copyToClipboard(text)
            }

            console.log(assetTypeLabel[props.entity.typeName])
            return { handleCopyProfileLink, assetTypeLabel }
        },
    })
</script>
