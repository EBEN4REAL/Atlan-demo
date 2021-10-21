<template>
    <div class="w-2/3 mt-5">
        <div class="flex justify-between w-full -items-center">
            <span class="self-start text-lg font-bold">Popular Glossaries</span>
            <span
                class="self-end cursor-pointer text-primary"
                @click="
                    redirectToProfile(entities[0]?.typeName, entities[0]?.guid, { cta: 'glossaryContext' })
                "
                >View all
            </span>
        </div>
        <div v-if="isLoading" class="flex justify-center w-full">
            <a-spin size="small" class="mt-2 mr-2 leading-none"></a-spin>
        </div>
        <div
            v-else
            class="flex items-center justify-between pt-4 space-x-4"
            :class="$style.menuClasses"
        >
            <template v-for="item in entities" :key="item.guid">
                <div class="w-full px-3 py-4 bg-white border rounded">
                    <div class="flex items-center mb-2 text-gray-500">
                        <atlan-icon
                            :icon="
                                getEntityStatusIcon(
                                    'glossary',
                                    item.attributes?.certificateStatus
                                )
                            "
                            class="w-auto h-4 mr-1"
                        />
                        Glossary
                    </div>
                    <div class="flex items-center">
                        <span
                            class="font-bold cursor-pointer hover:underline"
                            @click="redirectToProfile(item.typeName, item.guid)"
                        >
                            {{ item.displayText }}
                        </span>
                        <StatusBadge
                            :key="item?.guid"
                            :status-id="item?.attributes?.certificateStatus"
                            :show-chip-style-status="false"
                            :show-label="false"
                            class="p-0 ml-2 mb-0.5"
                        ></StatusBadge>
                    </div>
                    <span
                        v-if="
                            item.attributes.shortDescription &&
                            item.attributes.shortDescription !== ''
                        "
                        class="text-xs text-gray-500"
                    >
                        {{ item.attributes.shortDescription }}
                    </span>
                    <span v-else class="text-xs text-gray-500">
                        No description available
                    </span>
                    <div
                        class="flex items-center mt-4 cursor-pointer  text-primary"
                    >
                        <span 
                            v-if="item.attributes?.terms?.length"
                            @click="redirectToProfile(item.typeName, item.guid, { tab: 'terms'} )"
                        >
                            See all {{ item.attributes.terms.length }} terms
                        </span>
                        <span 
                            v-else
                            @click="redirectToProfile(item.typeName, item.guid, { cta: 'addTerm'} )"
                        >
                             Add terms 
                        </span>
                        <atlan-icon icon="ArrowRight" class="w-auto h-4 ml-1" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    // components
    import LoadingView from '@common/loaders/page.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    // composables
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
    // utils
    import getEntityStatusIcon from '@/glossary/utils/getEntityStatusIcon'
    import redirect from '@/glossary/utils/redirectToProfile'

    export default defineComponent({
        components: { LoadingView, StatusBadge },
        setup() {
            const searchQuery = ref<string>()
            const router = useRouter()
            const { entities, isLoading, fetchAssetsPaginated } = useGtcSearch(
                undefined,
                ref(true),
                'AtlasGlossary',
                3
            )

            const onSearch = useDebounceFn(() => {
                fetchAssetsPaginated({
                    query: `${searchQuery.value ? `${searchQuery.value}` : ''}`,
                    offset: 0,
                })
            }, 400)
            const redirectToProfile = redirect(router)

            return {
                entities,
                onSearch,
                searchQuery,
                redirectToProfile,
                isLoading,
                getEntityStatusIcon,
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
