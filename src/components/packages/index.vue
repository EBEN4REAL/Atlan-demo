<template>
    <div class="flex flex-1">
        <div class="flex flex-col w-full h-full">
            <div class="flex flex-1 w-full overflow-y-auto">
                <div
                    class="flex flex-col bg-gray-100 border-r border-gray-300 filters"
                >
                    <PackageFilters
                        :filter-list="packageFilters"
                    ></PackageFilters>
                </div>

                <div class="flex flex-col flex-1 h-full">
                    <div
                        class="flex flex-col px-6 py-3 pb-4 font-extrabold focus-within:text-2xl"
                    >
                        <a-input
                            size="large"
                            placeholder="Search Packages"
                        ></a-input>
                    </div>

                    <div class="flex flex-1 overflow-y-auto">
                        <PackageList
                            :list="list"
                            class="px-6"
                            @select="handleSelect"
                        ></PackageList>
                    </div>
                    <div
                        class="flex items-center p-3 text-base font-bold border-t border-gray-200 overflow-ellipsis"
                    >
                        <a-button
                            type="primary"
                            block
                            @click.shift.exact="handleSetupSandbox"
                            @click.exact="handleSetup"
                            >Setup</a-button
                        >
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
            ErrorView,
            EmptyView,
        },
        props: {
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

            const handleSetup = (item) => {
                emit('setup', selectedPackage.value)
            }
            const handleSetupSandbox = (item) => {
                emit('sandbox', selectedPackage.value)
            }

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
                source: ref({
                    excludes: ['spec'],
                }),
            })

            const placeholder = computed(() => 'Search all packages')

            const selectedPackage = ref<any>(null)

            const handleSelect = (item) => {
                selectedPackage.value = item
                emit('select', item)
            }

            return {
                placeholder,
                dirtyTimestamp,
                searchDirtyTimestamp,
                isLoading,
                list,
                handleSelect,
                selectedPackage,

                error,
                packageFilters,
                facets,
                handleSetupSandbox,
                handleSetup,
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
