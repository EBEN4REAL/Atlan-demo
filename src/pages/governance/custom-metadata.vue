<template>
    <!-- <div class="h-full" v-if="permissions.list"> -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
        <a-spin size="large" />
    </div>
    <div v-else-if="error">
        <a-empty :image="null">
            <template #description>
                <p class="text-2xl font-bold">Error loading your request</p>
            </template>

            <a-button type="danger" @click="fetchBMonStore()"
                ><AtlanIcon icon="Add" class="inline" /> Try again
            </a-button>
        </a-empty>
    </div>
    <ExplorerLayout
        v-else-if="finalBusinessMetadataList.length"
        title="Custom Metadata"
        sidebar-class="bg-white"
    >
        <template #action>
            <AtlanBtn
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="addMetaDataModal.open()"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
        </template>

        <template #sidebar>
            <div class="px-4 pt-6 pb-4">
                <SearchAndFilter
                    v-model:value="searchText"
                    :placeholder="`Search`"
                    class="bg-white"
                />
            </div>

            <BusinessMetadataList
                class="overflow-y-auto"
                :final-list="sortedSearchedBM"
                :selected-bm="selectedBm"
                @selectBm="handleSelectBm"
            />
        </template>

        <BusinessMetadataProfile
            v-if="selectedBm"
            :key="selectedBm && selectedBm.guid"
            :selected-bm="selectedBm"
            @selectBm="handleSelectBm"
            @update="onUpdate"
        />
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
                <p class="text-2xl font-bold">Start adding custom metadata</p>
            </template>

            <a-button type="primary" @click="addMetaDataModal.open()"
                ><AtlanIcon icon="Add" class="inline" /> Create new metadata
            </a-button>
        </a-empty>
    </div>
    <!-- </div> -->
    <!-- <NoAccess v-else /> -->
    <MetadataModal ref="addMetaDataModal" @selectBm="handleSelectBm" />
</template>
<script lang="ts">
    // ? components
    import { defineComponent, computed, onMounted, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import BusinessMetadataList from '@/admin/custom-metadata/businessMetadataList.vue'
    import BusinessMetadataProfile from '@/admin/custom-metadata/businessMetadataProfile.vue'
    import MetadataModal from '~/components/admin/custom-metadata/metadataModal.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import NoAccess from '@/admin/common/noAccessPage.vue'

    // ? Store
    import { useTypedefStore } from '~/store/typedef'

    // ? Composables
    import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'

    import EmptyBusinessMetadata from '~/assets/images/illustrations/empty_business_metadata.svg'
    import noMetadataImage from '~/assets/images/admin/no-metadata.png'

    export default defineComponent({
        name: 'BusinessMetadata',
        components: {
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
            useHead({
                title: computed(() => 'Custom Metadata'),
            })

            const {
                fetchBMonStore,
                selectedBm,
                searchText,
                handleSelectBm,
                onUpdate,
                businessMetadataList,
                error,
                isLoading,
                searchedBusinessMetadataList,
                finalBusinessMetadataList,
                sortedSearchedBM,
            } = useBusinessMetadata()

            onMounted(() => {
                fetchBMonStore()
            })

            return {
                businessMetadataList,
                error,
                isLoading,
                finalBusinessMetadataList,
                searchText,
                searchedBusinessMetadataList,
                selectedBm,
                addMetaDataModal,
                onUpdate,
                handleSelectBm,
                sortedSearchedBM,
                fetchBMonStore,
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