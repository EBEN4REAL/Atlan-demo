<template>
    <a-modal
        v-model:visible="visible"
        :width="700"
        :class="$style.linkedAssetsModal"
    >
        <template #closeIcon></template>
        <template #footer>
            <div class="flex justify-end pb-1.5 bg-new-gray-100">
                <AtlanButton2 label="Done" @click="visible = false" />
            </div>
        </template>
        <div
            class="absolute flex items-center w-full p-3 text-sm rounded-lg gap-x-1 bg-new-yellow-100 text-new-yellow-700"
            style="top: -3.2rem"
        >
            <AtlanIcon
                icon="Overview"
                class="bg-white rounded-full text-new-yellow-700"
            />
            <span>
                You will be able to delete <b>{{ metadata.displayName }}</b
                >, once all linked assets are removed from
                <b>{{ metadata.displayName }}</b
                >.
            </span>
        </div>
        <div class="flex flex-col overflow-hidden linkedAssetModal">
            <header
                class="p-6 mb-3 space-y-1 border-b rounded-t-lg border-new-gray-200 bg-new-gray-100"
            >
                <div class="text-lg font-bold">Remove Linked Assets</div>
                <div
                    class="flex items-center text-sm gap-x-2 text-new-gray-600"
                >
                    <div class="flex items-center gap-x-2">
                        <CustomMetadataAvatar
                            class="overflow-hidden rounded cm-avatar hover:bg-gray-100"
                            :metadata="metadata"
                        />
                        <span class="">
                            {{ metadata.displayName }}
                        </span>
                    </div>
                    <span class="text-gray-300">•</span>
                    <span class="text-gray-500">
                        {{ assetCount }} Assets linked
                    </span>
                </div>
            </header>
            <section class="space-y-2.5 overflow-y-auto mb-3">
                <a-menu
                    v-model:selectedKeys="selectedKeys"
                    :open-keys="openKeys"
                    mode="inline"
                    :class="{
                        [$style.menu]: true,
                    }"
                    class="px-3"
                    @openChange="onOpenChange"
                >
                    <LinkedAssetsSubMenu
                        :linked-assets="linkedAssets"
                        :metadata="metadata"
                        :open-keys="openKeys"
                        @metadataRemove="(id) => emit('metadataRemove', id)"
                    />
                </a-menu>
                <div class="">
                    <div
                        v-if="isLoadMore || isLoading"
                        class="flex items-center justify-center"
                    >
                        <button
                            :disabled="isLoading"
                            class="flex items-center justify-between px-3 py-2 transition-all duration-300 bg-white rounded-full text-primary"
                            :class="isLoading ? 'px-3 py-2' : ''"
                            @click="$emit('loadMore')"
                        >
                            <template v-if="!isLoading">
                                <p
                                    class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                                >
                                    Load more
                                </p>
                                <AtlanIcon icon="ArrowDown" />
                            </template>
                            <AtlanLoader v-else class="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, toRefs, ref, PropType } from 'vue'
    import CustomMetadataAvatar from '@/governance/custom-metadata/CustomMetadataAvatar.vue'
    import LinkedAssetsSubMenu from '@/governance/custom-metadata/linkedAssets/linkedAssetSubMenuWrapper.vue'

    // TODO add pagination

    const props = defineProps({
        visible: {
            type: Boolean,
            required: true,
        },
        isLoading: {
            type: Boolean,
            required: true,
        },
        isLoadMore: {
            type: Boolean,
            required: true,
        },
        linkedAssets: {
            type: Object as PropType<any>,
            required: true,
        },
        assetCount: {
            type: Number,
            required: true,
        },
        metadata: {
            type: Object,
            required: true,
        },
    })
    const emit = defineEmits(['metadataRemove', 'loadMore'])

    const { visible } = useVModels(props, emit)
    const { linkedAssets } = toRefs(props)

    const openKeys = ref([])
    const selectedKeys = ref([])

    const onOpenChange = (key: string[]) => {
        openKeys.value = [key[key.length - 1]]
    }
</script>

<style lang="less" scoped>
    .linkedAssetModal {
        min-height: calc(100vh - 25rem);
        max-height: calc(100vh - 15rem);
    }

    .cm-avatar {
        @apply cursor-default !important;
    }
</style>

<style lang="less" module>
    .linkedAssetsModal {
        :global(.ant-modal-content) {
            @apply rounded-lg  !important;
        }
        :global(.ant-modal-footer) {
            @apply p-4 bg-new-gray-100 border-t border-new-gray-200 rounded-b-lg !important;
        }
    }
    .menu {
        div {
            line-height: normal;
            @apply whitespace-normal;
        }
        @apply border-none  !important;
        :global(.ant-menu-submenu) {
            margin-bottom: -2px;
        }
        :global(.ant-menu-submenu-title) {
            @apply h-full p-0 m-0 !important;
            :global(.ant-menu-submenu-arrow) {
                @apply hidden !important;
            }
        }

        :global(.ant-menu-title-content) {
            @apply cursor-default;
        }

        :global(.ant-menu-item) {
            @apply h-full  bg-white px-0 !important;
        }

        :global(.ant-menu-submenu-title:active) {
            @apply bg-transparent;
        }

        :global(.ant-menu-inline) {
            @apply bg-white overflow-hidden !important;
        }

        :global(.ant-menu-item-selected) {
            @apply text-gray-700;
        }
        :global(.ant-menu-item:hover) {
            @apply text-gray-700;
        }
    }
    :global(.ant-menu-item::after) {
        @apply border-r-0 !important;
    }
</style>
