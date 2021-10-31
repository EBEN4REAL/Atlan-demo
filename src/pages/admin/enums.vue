<template>
    <ExplorerLayout
        v-if="permissions.list"
        title="Enumerations"
        sub-title="Create & manage Enumerations"
    >
        <template v-if="permissions.create" #action>
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
    <NoAcces v-else />
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { useHead } from '@vueuse/head'

    import useEnums from '@/admin/enums/composables/useEnums'
    import EnumList from '@/admin/enums/enumList.vue'
    import EnumDetails from '@/admin/enums/enumDetails.vue'
    import AddEnumModal from '@/admin/enums/addEnumModal.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { useAccessStore } from '~/services/access/accessStore'
    import NoAcces from '@/common/secured/access.vue'
    import useAuth from '~/composables/auth/useAuth'

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
            const accessStore = useAccessStore()
            const permissions = computed(() => ({
                list: accessStore.checkPermission('LIST_BUSINESS_METADATA'),
                create: accessStore.checkPermission('CREATE_BUSINESS_METADATA'),
            }))
            const { enumListData, selectedId, selectedEnum, addToList } =
                useEnums()
            const addModalVisible = ref(false)

            function toggleAddModal(state: boolean) {
                addModalVisible.value = state
            }

            const { isAccess } = useAuth()

            return {
                enumListData,
                addModalVisible,
                selectedId,
                selectedEnum,
                permissions,
                toggleAddModal,
                addToList,
                isAccess,
            }
        },
    })
</script>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
