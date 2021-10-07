<template>
    <div
        class="flex flex-col items-center w-full pt-5 mb-5"
        :class="$style.menuClasses"
    >
        <a-dropdown :trigger="['click']">
            <a-input-search
                v-model:value="searchQuery"
                placeholder="Search across Glossaries"
                class="w-1/2"
                @change="onSearch"
            />
            <template #overlay>
                <a-menu class="overflow-y-auto max-h-40">
                    <template v-for="item in entities" :key="item.guid">
                        <a-menu-item class="flex items-center py-2">
                            <div class="flex flex-col py-1 ml-3">
                                <span class="flex items-center space-x-2"
                                    >{{ item.displayText }}
                                    <StatusBadge
                                        :key="item?.guid"
                                        :status-id="
                                            item?.attributes?.assetStatus
                                        "
                                        :show-chip-style-status="false"
                                        :show-no-status="true"
                                        :show-label="false"
                                        class="p-0 ml-2"
                                    ></StatusBadge>
                                </span>
                                <span class="text-xs text-gray-500">
                                    Parent glossary name goes here
                                </span>
                            </div>
                            <template #icon>
                                <atlan-icon
                                    v-if="
                                        item?.typeName === 'AtlasGlossaryTerm'
                                    "
                                    icon="Term"
                                    class="w-auto h-4"
                                />
                                <atlan-icon
                                    v-if="
                                        item?.typeName ===
                                        'AtlasGlossaryCategory'
                                    "
                                    icon="Category"
                                    class="w-auto h-4"
                                />
                            </template>
                        </a-menu-item>
                    </template>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    // components
    import StatusBadge from '@common/badge/status/index.vue'
    // composables
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'

    export default defineComponent({
        components: {
            StatusBadge,
        },
        setup() {
            const searchQuery = ref<string>()
            const { entities, fetchAssetsPaginated } = useGtcSearch(
                undefined,
                ref(true),
                'AtlasGlossaryTerm,AtlasGlossaryCategory'
            )
            const onSearch = useDebounceFn(() => {
                fetchAssetsPaginated({
                    query: `${searchQuery.value ? `${searchQuery.value}` : ''}`,
                    offset: 0,
                })
            }, 400)

            return {
                entities,
                onSearch,
                searchQuery,
            }
        },
    })
</script>
<style lang="less" module>
    .menuClasses {
        :global(.ant-dropdown-menu-item) {
            @apply bg-gray-100 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
