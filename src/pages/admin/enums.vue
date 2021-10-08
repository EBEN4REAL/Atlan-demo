<template>
    <ExplorerLayout
        title="Enumerations"
        sub-title="Create & manage Enumerations"
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
            <EnumList v-model:selected="selectedId" :list="enumListData" />
        </template>

        <AddEnumModal
            v-if="addModalVisible"
            @add="addToList"
            @close="toggleAddModal(false)"
        />
        <EnumDetails
            v-if="selectedId"
            :key="selectedId"
            v-model:selectedEnum="selectedEnum"
        />
        <span v-else>No Enum Selected</span>
    </ExplorerLayout>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useHead } from '@vueuse/head'

    import useEnums from '@/admin/enums/composables/useEnums'
    import EnumList from '@/admin/enums/enumList.vue'
    import EnumDetails from '@/admin/enums/enumDetails.vue'
    import AddEnumModal from '@/admin/enums/addEnumModal.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        components: {
            EnumList,
            EnumDetails,
            AddEnumModal,
            ExplorerLayout,
            SearchAndFilter,
            AtlanBtn,
        },
        setup() {
            useHead({
                title: 'Enums',
            })
            const { enumListData, selectedId, selectedEnum, addToList } =
                useEnums()
            const addModalVisible = ref(false)

            function toggleAddModal(state: boolean) {
                addModalVisible.value = state
            }

            return {
                enumListData,
                addModalVisible,
                selectedId,
                selectedEnum,
                toggleAddModal,
                addToList,
            }
        },
    })
</script>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
