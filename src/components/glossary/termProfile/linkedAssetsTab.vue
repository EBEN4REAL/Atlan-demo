<template>
    <div class="w-full pb-6">
        <!-- <div class="mb-4">
            <a-input-search
                v-model:value="searchQuery"
                :placeholder="`Search ${assets?.length} assets...`"
                class="w-80"
                @change="onSearch"
            ></a-input-search>
        </div> -->
        <!-- <a-tabs
            v-if="assets?.length"
            default-active-key="1"
            class="border-0"
        >
            <a-tab-pane key="1" :tab="`All (${assets?.length})`">
                <div class="flex w-full h-full">
                    <div class="w-full item-stretch">
                        <div class="h-full">
                            <div
                                v-if="
                                    assets &&
                                    assets.length <= 0 &&
                                    !isLoading 
                                "
                                class="flex-grow"
                            >
                                <EmptyView></EmptyView>
                            </div>
                            <AssetList
                                v-else
                                :list="assets"
                                :projection="[
                                    'heirarchy',
                                    'description',
                                    'owners',
                                ]"
                                :is-loading="isLoading"
                                @preview="(asset) => $emit('preview', asset)"
                            ></AssetList>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <div v-else class="mt-24">
            <EmptyView :showClearFiltersCTA="false" />
        </div> -->
        <AssetDiscovery
            :show-filters="false"
            :initial-filters="initialFilters"
            :termName="termName"
            @preview="(asset) => $emit('preview', asset)"
        ></AssetDiscovery>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, onMounted, watch, ref } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'

    import AssetList from '@/discovery/asset/list/index.vue'
    import EmptyView from '@common/empty/discover.vue'
    import AssetDiscovery from '@/discovery/asset/index.vue'

    import useTermLinkedAssets from '~/composables/glossary/useTermLinkedAssets'
    import { getDecodedOptionsFromString } from '~/utils/routerQuery'

    interface PropsType {
        termQualifiedName: string
        termCount: number
    }

    export default defineComponent({
        components: { AssetList, EmptyView, AssetDiscovery },
        props: ['termQualifiedName', 'termCount'],
        emits: ['preview'],
        setup(props: PropsType) {
            // data
            const router = useRouter()
            const initialFilters = getDecodedOptionsFromString(router)
            const searchQuery = ref<string>()
            const { linkedAssets, isLoading, error, fetchLinkedAssets } =
                useTermLinkedAssets()

            // computed
            const termName = computed(() => props.termQualifiedName)
            const assets = computed(() => linkedAssets.value?.entities ?? [])
            const assetCount = computed(() => assets.value?.length ?? 0)
            const numberOfTerms = computed(() => props.termCount ?? 5)

            // methods
            const onSearch = useDebounceFn(() => {
                fetchLinkedAssets(termName.value, `*${searchQuery.value}*`)
            }, 0)

            // lifecycle methods and watchers
            onMounted(() => {
                if (termName.value) fetchLinkedAssets(termName.value)
            })

            watch(termName, (newTermName) => {
                if (newTermName) fetchLinkedAssets(newTermName)
            })

            return {
                termName,
                assets,
                isLoading,
                assetCount,
                numberOfTerms,
                searchQuery,
                onSearch,
                initialFilters,
                AssetDiscovery,
            }
        },
    })
</script>
