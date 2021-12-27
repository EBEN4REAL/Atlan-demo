<template>
    <div class="max-w-sm mb-5">
        <Search
            v-model="searchText"
            :placeholder="`Search from ${personaList.length} purposes`"
        />
    </div>
    <div class="flex-grow px-2 overflow-y-auto divide-y">
        <template v-for="p in personaList" :key="p.guid">
            <PurposeCard :p="p" :classification-list="classificationList" />
        </template>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import {
        reFetchList,
        personaList,
        filteredPersonas,
        searchTerm,
        selectedPersona,
        selectedPersonaId,
        isPersonaListReady,
        isPersonaLoading,
        isPersonaError,
    } from '@/governance/purposes/composables/usePurposeList'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import PurposeCard from './listCard.vue'

    const { classificationList } = useTypedefData()
    import Search from '@/common/input/searchAdvanced.vue'

    const searchText = ref('')
</script>

<style scoped></style>
