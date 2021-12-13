<template>
    <div
        class="flex justify-between p-2 border rounded cursor-pointer hover:bg-gray-100"
    >
        <div class="flex flex-1" @click="openLink(link(item))">
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
                <a
                    class="flex cursor-pointer gap-x-2 hover:underline"
                    :href="`${link(item)}`"
                    target="_blank"
                    rel="noreferrer"
                >
                    <span class="font-bold">{{ title(item) }}</span>
                </a>
                <span
                    v-if="createdBy(item) === modifiedBy(item)"
                    class="text-sm text-gray-500"
                    >Added by {{ createdBy(item) }} {{ createdAt(item) }}
                </span>
                <span v-else class="text-sm text-gray-500"
                    >Edited by {{ modifiedBy(item) }} {{ modifiedAt(item) }}
                </span>
            </div>
        </div>
        <div>
            <a-dropdown trigger="click" placement="bottomRight">
                <a-button
                    class="px-2 bg-transparent border-none shadow-none hover:bg-white hover:shadow-sm"
                >
                    <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
                </a-button>

                <template #overlay>
                    <a-menu mode="vertical">
                        <a-menu-item
                            key="delete"
                            @click="handleResourceDelete(item.guid)"
                        >
                            <div class="flex items-center text-red-500">
                                <AtlanIcon
                                    icon="Delete"
                                    class="h-4 mb-0.5 mr-1"
                                />
                                Delete
                            </div>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, PropType, toRefs, ref, inject } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
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
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

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

            const { handleResourceDelete } =
                updateAssetAttributes(selectedAsset)

            return {
                createdBy,
                handleResourceDelete,
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
