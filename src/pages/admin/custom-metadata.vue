<template>
    <ExplorerLayout
        v-if="permissions.list"
        title="Custom Metadata"
        sub-title="Manage Custom Metadata & it's attributes"
    >
        <template v-if="permissions.create" #action>
            <AtlanBtn
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="onCreateNewBmClick"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
        </template>

        <template #sidebar>
            <SearchAndFilter
                v-model:value="searchText"
                class="mx-4 mt-6 mb-4 bg-white"
            />

            <BusinessMetadataList
                class="overflow-y-auto"
                :final-list="
                    searchText
                        ? searchedBusinessMetadataList
                        : finalBusinessMetadataList
                "
                :updated-bm="updatedBm"
                :selected-bm="selectedBm"
                @selectBm="handleSelectBm"
            />
        </template>

        <BusinessMetadataProfile
            v-if="selectedBm"
            :key="selectedBm && selectedBm.guid"
            :selected-bm="selectedBm"
            style="height: calc(100vh - 6rem); overflow: hidden"
            @selectBm="handleSelectBm"
            @update="onUpdate"
            @clearUpdatedBm="updatedBm = null"
            @removeNewBm="discardNewBm"
            @afterArchive="handleAfterArchive"
            @clearNewBm="newBm = null"
        />
    </ExplorerLayout>
    <NoAcces v-else />
</template>
<script lang="ts">
    // ? components
    import { defineComponent, computed, onMounted } from 'vue'
    import { useHead } from '@vueuse/head'
    import BusinessMetadataList from '@/admin/custom-metadata/businessMetadataList.vue'
    import BusinessMetadataProfile from '@/admin/custom-metadata/businessMetadataProfile.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { useAccessStore } from '~/services/access/accessStore'

    // ? Media

    // ? Composables
    import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'

    import EmptyBusinessMetadata from '~/assets/images/illustrations/empty_business_metadata.svg'
    import NoAcces from '@/admin/common/noAccessPage.vue'

    export default defineComponent({
        name: 'BusinessMetadata',
        components: {
            BusinessMetadataList,
            BusinessMetadataProfile,
            ExplorerLayout,
            SearchAndFilter,
            AtlanBtn,
            NoAcces
        },
        setup() {
            useHead({
                title: computed(() => 'Custom Metadata'),
            })
            const accessStore = useAccessStore();
            const permissions = computed(() => ({
                list: accessStore.checkPermission('LIST_BUSINESS_METADATA'),
                create: accessStore.checkPermission('CREATE_BUSINESS_METADATA'),
                delete: accessStore.checkPermission('DELETE_BUSINESS_METADATA'),
            }))
            const {
                fetchBMonStore,
                selectedBm,
                discardNewBm,
                searchText,
                handleSelectBm,
                clearSearchText,
                newBm,
                updatedBm,
                onUpdate,
                handleAfterArchive,
                onCreateNewBmClick,
                businessMetadataList,
                businessMetadataListError,
                searchedBusinessMetadataList,
                finalBusinessMetadataList,
            } = useBusinessMetadata()

            onMounted(() => {
                fetchBMonStore()
            })

            return {
                EmptyBusinessMetadata,
                businessMetadataList,
                businessMetadataListError,
                clearSearchText,
                discardNewBm,
                finalBusinessMetadataList,
                handleAfterArchive,
                handleSelectBm,
                newBm,
                onCreateNewBmClick,
                onUpdate,
                searchText,
                searchedBusinessMetadataList,
                selectedBm,
                updatedBm,
                permissions
            }
        },
    })
</script>
<style scoped></style>
