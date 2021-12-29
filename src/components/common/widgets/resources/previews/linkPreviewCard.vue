<template>
    <div
        class="flex justify-between p-2 border rounded cursor-pointer hover:bg-gray-100"
    >
        <div class="flex items-center flex-1" @click="openLink(link(item))">
            <div class="mr-2 min-w-link-left-col">
                <img
                    :src="`https://www.google.com/s2/favicons?domain=${link(
                        item
                    )}&sz=64`"
                    :alt="title(item)"
                    class="h-7"
                />
            </div>
            <div class="flex flex-col">
                <a :href="`${link(item)}`" target="_blank" rel="noreferrer"
                    ><Tooltip
                        :tooltip-text="title(item) || link(item)"
                        classes="hover:text-primary font-bold cursor-pointer hover:underline"
                    />
                </a>
                <div
                    v-if="createdBy(item) === modifiedBy(item)"
                    class="text-sm text-gray-500"
                >
                    Added by {{ createdBy(item) }} {{ createdAt(item) }}
                </div>
                <div v-else class="text-sm text-gray-500">
                    Edited by {{ modifiedBy(item) }} {{ modifiedAt(item) }}
                </div>
            </div>
        </div>
        <div>
            <a-dropdown trigger="click" placement="bottomRight">
                <div>
                    <AtlanIcon
                        icon="KebabMenu"
                        class="h-4 m-0 cursor-pointer hover:text-primary"
                    />
                </div>

                <template #overlay>
                    <a-menu mode="vertical">
                        <EditResource
                            :asset="selectedAsset"
                            :edit-permission="editPermission"
                            :item="item"
                            :updating="true"
                            ><template #trigger>
                                <a-menu-item key="edit">
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Edit"
                                            class="h-4 mb-0.5 mr-1"
                                        />
                                        Edit
                                    </div>
                                </a-menu-item></template
                            ></EditResource
                        >
                        <DeleteResource
                            :asset="selectedAsset"
                            :item="item"
                            :edit-permission="editPermission"
                            ><template #trigger>
                                <a-menu-item key="delete">
                                    <div class="flex items-center text-red-500">
                                        <AtlanIcon
                                            icon="Delete"
                                            class="h-4 mb-0.5 mr-1"
                                        />
                                        Delete
                                    </div>
                                </a-menu-item></template
                            ></DeleteResource
                        >
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, PropType } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import DeleteResource from '../deleteResource.vue'
    import EditResource from '../addResource.vue'
    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: { DeleteResource, EditResource, Tooltip },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup() {
            function openLink(url) {
                if (!url) {
                    return
                }
                window.open(url)
            }
            const {
                createdBy,
                modifiedBy,
                createdAt,
                modifiedAt,
                title,
                link,
            } = useAssetInfo()

            return {
                createdBy,
                modifiedBy,
                createdAt,
                modifiedAt,
                title,
                link,
                openLink,
            }
        },
    })
</script>
<style lang="less" scoped>
    .min-w-link-left-col {
        min-width: 2rem;
    }
</style>
