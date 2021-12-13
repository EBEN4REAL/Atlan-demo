<template>
    <div class="flex flex-1">
        <div class="flex flex-col h-full">
            <div
                class="flex items-center px-5 py-3 text-base font-bold border-b border-gray-200 overflow-ellipsis"
            >
                <a-button class="mr-3"
                    ><AtlanIcon icon="ChevronLeft"></AtlanIcon
                ></a-button>
                Select a package
            </div>

            <div class="flex flex-1 overflow-y-auto">
                <div
                    v-if="showFilters"
                    class="flex flex-col bg-gray-100 border-r border-gray-300 filters"
                >
                    <PackageFilters
                        :filter-list="packageFilters"
                    ></PackageFilters>
                </div>

                <div class="flex flex-col flex-1 h-full py-4">
                    <div
                        class="flex flex-col px-6 py-4 pb-4 font-extrabold focus-within:text-2xl"
                    >
                        <a-input
                            class="w-1/2"
                            placeholder="Search Packages"
                        ></a-input>
                    </div>

                    <div
                        class="flex flex-col px-6 py-4"
                        v-if="list?.length == 0"
                    >
                        <div
                            v-if="isLoading"
                            class="flex items-center justify-center flex-grow"
                        >
                            <AtlanIcon
                                icon="Loader"
                                class="w-auto h-10 animate-spin"
                            ></AtlanIcon>
                        </div>
                        <div
                            v-if="!isLoading && error"
                            class="flex items-center justify-center flex-grow"
                        ></div>
                        <div
                            v-else-if="list?.length === 0 && !isLoading"
                            class="flex-grow"
                        ></div>
                    </div>
                    <div class="flex flex-1 overflow-y-auto">
                        <PackageList
                            :list="list"
                            class="px-6"
                            @select="handleSelect"
                        ></PackageList>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import PackageList from '@/packages/list/index.vue'
    import PackageFilters from '@/packages/filters/index.vue'
    import { packageFilters } from '~/constant/filters/packageFilters'
    import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: {
            PackageFilters,
            PackageList,
            EmptyView,
            // PackageFilters,
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
        emits: ['setup', 'sandbox', 'select'],
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
                emit('select', item)
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
                facets,
            }
        },
    })
</script>

<style lang="less">
    .filters {
        max-width: 264px;
        width: 25%;
    }
</style>
