<template>
    <div v-if="isAccess" class="h-full">
        <div v-auth="map.LIST_BUSINESS_METADATA" class="h-full">
            <div v-if="isLoading" class="flex items-center justify-center h-64">
                <a-spin size="large" />
            </div>
            <div v-else-if="error">
                <a-empty :image="null">
                    <template #description>
                        <p class="text-2xl font-bold">
                            Error loading your request
                        </p>
                        <p>Try reloading page</p>
                    </template>

                    <!-- <a-button type="danger" @click="fetchBMonStore()"
                    ><AtlanIcon icon="Add" class="inline" /> Try again
                </a-button> -->
                </a-empty>
            </div>
            <ExplorerLayout
                v-else-if="finalBusinessMetadataList.length"
                title="Custom Metadata"
                sidebar-class="bg-white"
            >
                <template #action> </template>

                <template #sidebar>
                    <div class="flex items-center px-4 mb-3">
                        <SearchAndFilter
                            v-model:value="searchText"
                            :placeholder="`Search from ${sortedSearchedBM.length} metadata`"
                            class="mt-0 bg-white"
                            :autofocus="true"
                            size="minimal"
                        />
                        <a-tooltip>
                            <template #title>New Custom Metadata</template>
                            <AtlanBtn
                                v-auth="map.CREATE_BUSINESS_METADATA"
                                class="flex-none px-2 ml-4"
                                size="sm"
                                color="secondary"
                                padding="compact"
                                @click="addMetaDataModal.open()"
                            >
                                <AtlanIcon icon="Add" />
                            </AtlanBtn>
                        </a-tooltip>
                    </div>

                    <BusinessMetadataList
                        v-model:selected="selectedId"
                        class="overflow-y-auto"
                        :final-list="sortedSearchedBM"
                        :selected-bm="selectedBm"
                        @select="select"
                    />
                </template>

                <BusinessMetadataProfile
                    v-if="selectedBm"
                    :key="selectedBm && selectedBm.guid"
                    :selected-bm="selectedBm"
                />
                <template v-else>
                    <EmptyView
                        empty-screen="Error"
                        headline="Not Found"
                        desc="The metadata you're looking for has been deleted or doesn't exist."
                    />
                </template>
            </ExplorerLayout>
            <div v-else class="flex items-center justify-center h-full">
                <a-empty
                    :image="noMetadataImage"
                    :image-style="{
                        height: '115px',
                        display: 'flex',
                        justifyContent: 'center',
                    }"
                >
                    <template #description>
                        <p
                            v-if="checkAccess(map.CREATE_BUSINESS_METADATA)"
                            class="text-2xl font-bold"
                        >
                            Start adding custom metadata
                        </p>
                        <p class="text-2xl font-bold">
                            No custom metadata is present
                        </p>
                    </template>

                    <a-button
                        v-auth="map.CREATE_BUSINESS_METADATA"
                        type="primary"
                        @click="addMetaDataModal.open()"
                        ><AtlanIcon icon="Add" class="inline" /> Create new
                        metadata
                    </a-button>
                </a-empty>
            </div>
        </div>
        <MetadataModal ref="addMetaDataModal" @select="select" />
    </div>
    <NoAccess v-else />
</template>
<script lang="ts">
    // ? components
    import {
        defineComponent,
        computed,
        onMounted,
        ref,
        watch,
        provide,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'
    import { useDebounceFn } from '@vueuse/core'
    import BusinessMetadataList from '@/governance/custom-metadata/businessMetadataList.vue'
    import BusinessMetadataProfile from '@/governance/custom-metadata/businessMetadataProfile.vue'
    import MetadataModal from '~/components/governance/custom-metadata/metadataModal.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import NoAccess from '@/admin/common/noAccessPage.vue'
    import { useTypedefStore } from '~/store/typedef'
    import map from '~/constant/accessControl/map'
    import EmptyView from '@/common/empty/index.vue'
    // ? Composables
    import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'
    import useAuth from '~/composables/auth/useAuth'

    import EmptyBusinessMetadata from '~/assets/images/illustrations/empty_business_metadata.svg'
    import noMetadataImage from '~/assets/images/admin/no-metadata.png'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'BusinessMetadata',
        components: {
            EmptyView,
            BusinessMetadataList,
            BusinessMetadataProfile,
            ExplorerLayout,
            SearchAndFilter,
            AtlanBtn,
            NoAccess,
            MetadataModal,
        },
        setup() {
            const addMetaDataModal = ref(null)
            const route = useRoute()
            useHead({
                title: computed(() => 'Custom Metadata'),
            })
            const {
                select,
                selectedId,
                selectedBm,
                searchText,
                handleSelectBm,
                error,
                isLoading,
                searchedBusinessMetadataList,
                finalBusinessMetadataList,
                sortedSearchedBM,
                resetSelection,
            } = useBusinessMetadata()
            const { isAccess, checkAccess } = useAuth()

            const sendPageEvent = useDebounceFn(() => {
                if (selectedId.value) {
                    useTrackPage('governance', 'custom_metadata')
                }
            }, 500)

            onMounted(() => {
                sendPageEvent()
                if (route.params.id) {
                    select(route.params.id)
                } else resetSelection()
            })

            watch(selectedId, () => {
                sendPageEvent()
            })

            provide('resetSelection', resetSelection)
            return {
                selectedId,
                error,
                isLoading,
                finalBusinessMetadataList,
                searchText,
                searchedBusinessMetadataList,
                selectedBm,
                addMetaDataModal,
                handleSelectBm,
                sortedSearchedBM,
                map,
                isAccess,
                checkAccess,
                select,
            }
        },
        data() {
            return {
                noMetadataImage,
                EmptyBusinessMetadata,
            }
        },
    })
</script>
<style scoped></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_BUSINESS_METADATA]
</route>
