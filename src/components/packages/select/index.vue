<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <div
            v-if="showFilters"
            class="flex flex-col hidden h-full bg-gray-100 border-r border-gray-300 sm:block facets"
        >
            <PackageFilters :filter-list="packageFilters"></PackageFilters>
        </div>
        <div class="flex-col flex-1 h-full border-r border-gray-200">
            <div class="flex flex-col px-6 py-6 text-2xl font-extrabold">
                <a-input class="w-1/2" placeholder="Search Packages"></a-input>
            </div>

            <div
                class="flex flex-col px-6 overflow-y-auto"
                style="height: calc(100% - 100px)"
            >
                <div
                    v-if="isLoading"
                    class="flex items-center justify-center flex-grow"
                >
                    <AtlanLoader class="h-10" />
                </div>
                <div
                    v-if="!isLoading && error"
                    class="flex items-center justify-center flex-grow"
                >
                    <ErrorView></ErrorView>
                </div>
                <div
                    v-else-if="list.length === 0 && !isLoading"
                    class="flex-grow"
                >
                    <EmptyView
                        empty-screen="EmptyDiscover"
                        desc="
                           No packages were found
                        "
                        class="mb-10"
                    ></EmptyView>
                </div>

                <PackageList
                    :list="list"
                    @select="handleSelect"
                    v-else
                ></PackageList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, Ref, computed } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'

    import PackageList from '@/packages/list/index.vue'
    import PackageFilters from '../filters/index.vue'
    import { packageFilters } from '~/constant/filters/packageFilters'

    import Editor from '@/common/editor/index.vue'

    import { usePackageList } from '~/composables/package/usePackageList'
    import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            Editor,
            PackageList,
            EmptyView,
            PackageFilters,
            ErrorView,
        },
        props: {
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
            initialFilters: {
                type: Object,
                required: false,
                default: {},
            },
            showAggrs: {
                type: Boolean,
                required: false,
                default: true,
            },
            staticUse: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['setup', 'sandbox'],
        setup(props, { emit }) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                verified: true,
            })
            const dependentKey = ref('DEFAULT_PACKAGES')

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            // const { refresh, isLoading, list, error } = usePackageList({
            //     isCache: true,
            //     dependentKey,
            //     queryText,
            //     filters,
            //     limit,
            //     offset,
            // })

            const { isLoading, list, error } = usePackageDiscoverList({
                isCache: true,
                dependentKey,
                facets,
                limit,
                offset,
            })

            const placeholder = computed(() => 'Search all packages')

            const selectedPackage = ref<any>(null)

            const handleSelect = (item) => {
                selectedPackage.value = item
            }

            const handleSetup = (item) => {
                emit('setup', selectedPackage.value)
            }
            const handleSetupSandbox = (item) => {
                emit('sandbox', selectedPackage.value)
            }

            return {
                placeholder,
                dirtyTimestamp,
                searchDirtyTimestamp,
                isLoading,
                list,
                handleSelect,
                selectedPackage,
                handleSetup,
                error,
                handleSetupSandbox,
                packageFilters,
                list,
                facets,
            }
        },
    })
</script>

<style lang="less">
    .facets {
        max-width: 264px;
        width: 25%;
    }
</style>

<style lang="less" module>
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
    }
</style>

<style scoped>
    .asset-preview-container {
        min-width: 360px !important;
        max-width: 360px !important;
    }
</style>
