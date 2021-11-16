<template>
    <!-- <div v-if="permissions.list"> -->
    <div
        v-if="loadingState.pending"
        class="flex items-center justify-center h-64"
    >
        <a-spin size="large" />
    </div>
    <div v-else-if="loadingState.error">
        <a-empty :image="null">
            <template #description>
                <p class="text-2xl font-bold">Error loading your request</p>
            </template>

            <a-button type="danger" @click="refetchEnumList()"
                ><AtlanIcon icon="Add" class="inline" /> Try again
            </a-button>
        </a-empty>
    </div>
    <ExplorerLayout
        v-else-if="enumListData.length"
        title="Labels"
        sidebar-class="bg-white"
    >
        <template #action>
            <AtlanBtn
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="toggleAddModal(true)"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray" />
            </AtlanBtn>
        </template>

        <template #sidebar>
            <div class="px-4 pt-6 pb-4">
                <SearchAndFilter
                    v-model:value="searchText"
                    :placeholder="`Search from ${enumListData.length} labels`"
                    class="bg-white"
                />
            </div>
            <EnumList
                v-model:selected="selectedId"
                :list="sortedSearchedEnum"
            />
        </template>

        <EnumDetails
            v-if="selectedId"
            :key="selectedId"
            v-model:selectedEnum="selectedEnum"
        />
        <span v-else>No Enum Selected</span>
    </ExplorerLayout>
    <div v-else class="flex items-center justify-center h-full">
        <a-empty
            :image="noEnumImage"
            :image-style="{
                height: '115px',
                display: 'flex',
                justifyContent: 'center',
            }"
        >
            <template #description>
                <p class="text-2xl font-bold">Start adding labels</p>
            </template>

            <a-button type="primary" @click="addModalVisible = true"
                ><AtlanIcon icon="Add" class="inline" /> Create new label
            </a-button>
        </a-empty>
    </div>
    <!-- </div>
    <NoAcces v-else /> -->
    <AddEnumModal
        v-if="addModalVisible"
        @add="addToList"
        @close="toggleAddModal(false)"
    />
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { useHead } from '@vueuse/head'

    import useEnums from '@/governance/enums/composables/useEnums'
    import EnumList from '@/governance/enums/enumList.vue'
    import EnumDetails from '@/governance/enums/enumDetails.vue'
    import AddEnumModal from '@/governance/enums/addEnumModal.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    // import { useAccessStore } from '~/services/access/accessStore'
    import NoAcces from '@/admin/common/noAccessPage.vue'
    import noEnumImage from '~/assets/images/admin/no-metadata.png'

    export default defineComponent({
        components: {
            EnumList,
            EnumDetails,
            AddEnumModal,
            ExplorerLayout,
            SearchAndFilter,
            AtlanBtn,
            NoAcces,
        },
        setup() {
            useHead({
                title: 'Enums',
            })
            // const accessStore = useAccessStore()
            // const permissions = computed(() => ({
            //     list: accessStore.checkPermission('LIST_BUSINESS_METADATA'),
            //     create: accessStore.checkPermission('CREATE_BUSINESS_METADATA'),
            // }))
            const {
                enumListData,
                selectedId,
                selectedEnum,
                addToList,
                loadingState,
                searchText,
                sortedSearchedEnum,
                refetchEnumList,
            } = useEnums()
            const addModalVisible = ref(false)

            function toggleAddModal(state: boolean) {
                addModalVisible.value = state
            }

            return {
                enumListData,
                addModalVisible,
                selectedId,
                selectedEnum,
                // permissions,
                toggleAddModal,
                addToList,
                loadingState,
                searchText,
                sortedSearchedEnum,
                refetchEnumList,
            }
        },
        data() {
            return {
                noEnumImage,
            }
        },
    })
</script>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
