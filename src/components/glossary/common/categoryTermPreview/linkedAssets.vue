<template>
    <div class="py-6 px-2">
        <div class="mb-4 flex">
            <a-input-search
                v-model:value="searchQuery"
                :placeholder="`Search ${assets?.length} assets...`"
                class="mr-2"
                @change="onSearch"
            ></a-input-search>

            <a-popover trigger="click">
                <template #content>
                    <p class="mb-1 text-gray-500">Show/Hide</p>
                    <div class="w-32">
                        <a-checkbox-group
                            v-model:value="projection"
                            name="checkboxgroup"
                            :options="projectionOptions"
                        />
                    </div>
                </template>
                <a-button class="p-1 ml-2 rounded">
                    <AtlanIcon icon="FilterDot" class="h-6" />
                </a-button>
            </a-popover>
        </div>
        <div
            v-if="assets && assets.length <= 0 && !isLoading"
            class="flex-grow"
        >
            <EmptyView></EmptyView>
        </div>
        <AssetList
            v-else-if="assets.length"
            :list="assets"
            :projection="projection"
            :is-loading="isLoading"
        ></AssetList>
        <!-- <a-tabs
            v-if="assets?.length"
            type="card"
            default-active-key="1"
            class="border-0"
        >
            <a-tab-pane key="1" :tab="`All (${assets?.length})`">
                <div class="flex h-full">
                    <div class="item-stretch">
                        <div class="h-full">
                            <div
                                v-if="
                                    assets && assets.length <= 0 && !isLoading
                                "
                                class="flex-grow"
                            >
                                <EmptyView></EmptyView>
                            </div>
                            <AssetList
                                v-else-if="assets.length"
                                :list="assets"
                                :projection="projection"
                                :is-loading="isLoading"
                            ></AssetList>

                        </div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs> -->
        <!-- <AssetDiscovery
            v-if="assets.length"
            :show-filters="false"
            :initial-filters="initialFilters"
        ></AssetDiscovery> -->
        <div v-else class="mt-24">
            <EmptyView :showClearFiltersCTA="false" />
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, onMounted, watch, ref } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'

    import AssetList from '~/components/discovery/list/assetList.vue'
    import EmptyView from '@common/empty/discover.vue'
    import AssetDiscovery from '~/components/discovery/assetDiscovery.vue'

    import useTermLinkedAssets from '~/composables/glossary/useTermLinkedAssets'
    import { getDecodedOptionsFromString } from '~/utils/helper/routerQuery'

    export default defineComponent({
        components: { AssetList, EmptyView, AssetDiscovery },
        props: {
            termQualifiedName: {
                type: String,
                required: true,
                defualt: ',',
            },
        },
        setup(props) {
            const termName = computed(() => props.termQualifiedName)
            const router = useRouter()
            const initialFilters = getDecodedOptionsFromString(router)
            const { linkedAssets, isLoading, error, fetchLinkedAssets } =
                useTermLinkedAssets()

            const assets = computed(() => linkedAssets.value?.entities ?? [])
            const assetCount = computed(() => assets.value?.length ?? 0)

            const searchQuery = ref<string>()

            const projectionOptions = [
                { value: 'description', label: 'Description' },
                { value: 'heirarchy', label: 'Heirarchy' },
                { value: 'owners', label: 'Owners' },
                { value: 'rows', label: 'Rows' },
                { value: 'popularity', label: 'Popularity' },
                { value: 'classifications', label: 'Classifications' },
            ]
            const projection = ref(['heirarchy', 'description'])

            onMounted(() => {
                if (termName.value) fetchLinkedAssets(termName.value)
            })

            watch(termName, (newTermName) => {
                if (newTermName) fetchLinkedAssets(newTermName)
            })

            const onSearch = useDebounceFn(() => {
                fetchLinkedAssets(termName.value, `*${searchQuery.value}*`)
            }, 0)

            return {
                termName,
                assets,
                isLoading,
                assetCount,
                searchQuery,
                onSearch,
                projectionOptions,
                projection,
                initialFilters,
            }
        },
    })
</script>
