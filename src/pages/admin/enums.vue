<template>
    <div class="flex flex-col h-screen">
        <AddEnumModal
            v-if="addModalVisible"
            @add="addToList"
            @close="toggleAddModal(false)"
        />
        <p class="mb-0 text-2xl text-gray">Enumerations</p>
        <div class="flex items-center justify-between">
            <p class="text-sm text-gray">Create & manage Enumerations</p>
            <a-button
                class="rounded-md ant-btn ant-btn-primary"
                @click="toggleAddModal(true)"
            >
                New
            </a-button>
        </div>

        <div v-if="selectedId" class="flex flex-grow py-4 overflow-y-auto">
            <div class="flex-shrink-0 overflow-y-auto w-80">
                <EnumList v-model:selected="selectedId" :list="enumListData" />
            </div>
            <div class="flex-grow ml-4 overflow-y-auto">
                <EnumDetails
                    v-if="selectedId"
                    :key="selectedId"
                    v-model:selectedEnum="selectedEnum"
                />
                <span v-else>No Enum Selected</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import useEnums from '@/admin/enums/composables/useEnums'
    import EnumList from '@/admin/enums/enumList.vue'
    import EnumDetails from '@/admin/enums/enumDetails.vue'
    import AddEnumModal from '@/admin/enums/addEnumModal.vue'
    import { useHead } from '@vueuse/head'

    export default defineComponent({
        components: { EnumList, EnumDetails, AddEnumModal },
        setup() {
            useHead({
                title: 'Billings',
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
