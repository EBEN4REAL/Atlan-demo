<template>
    <div v-auth="map.LIST_ENUM" class="h-full">
        <div v-if="isLoading" class="flex items-center justify-center h-64">
            <a-spin size="large" />
        </div>
        <div v-else-if="error">
            <a-empty :image="null">
                <template #description>
                    <p class="text-2xl font-bold">Error loading your request</p>
                    <p>Try reloading page</p>
                </template>

                <!-- <a-button type="danger" @click="refetchEnumList()"
                    ><AtlanIcon icon="Add" class="inline" /> Try again
                </a-button> -->
            </a-empty>
        </div>
        <ExplorerLayout
            v-else-if="enumList.length"
            title="Enums"
            sidebar-class="bg-white"
        >
            <template #action>
                <AtlanBtn
                    v-auth="map.CREATE_ENUM"
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
                        :placeholder="`Search from ${enumList.length} enums`"
                        class="bg-white"
                    />
                </div>
                <EnumList
                    v-model:selected="selectedId"
                    :list="searchedEnumList"
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
                    <p class="text-2xl font-bold">Start adding enums</p>
                </template>

                <a-button type="primary" @click="addModalVisible = true"
                    ><AtlanIcon icon="Add" class="inline" /> Create new enum
                </a-button>
            </a-empty>
        </div>
    </div>
    <!--   <NoAcces v-else /> -->
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
    import NoAcces from '@/admin/common/noAccessPage.vue'
    import noEnumImage from '~/assets/images/admin/no-metadata.png'
    import map from '~/constant/accessControl/map'

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

            const {
                enumList,
                selectedId,
                selectedEnum,
                addToList,
                isLoading,
                searchText,
                searchedEnumList,
            } = useEnums()
            const addModalVisible = ref(false)

            function toggleAddModal(state: boolean) {
                addModalVisible.value = state
            }

            return {
                enumList,
                addModalVisible,
                selectedId,
                selectedEnum,
                // permissions,
                toggleAddModal,
                addToList,
                isLoading,
                searchText,
                searchedEnumList,
                map,
            }
        },
        data() {
            return {
                noEnumImage,
                error: null, // temp
            }
        },
    })
</script>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
