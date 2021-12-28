<template>
    <div
        v-if="isLoading && !searchText"
        class="flex items-center justify-center w-full h-full"
    >
        <AtlanIcon icon="Loader" class="animate-spin h-7" />
    </div>
    <template v-else-if="error">
        <ErrorView />
    </template>
    <template v-else-if="!personaList.length && !filter.displayName">
        <!-- !filter.displayName instead of !searchText -> leakage logic due to debounce, find better way to solve }} -->
        <EmptyView
            class="text-center"
            headline="No purpose is associated with this classification"
        />
    </template>
    <template v-else>
        <div class="max-w-sm mb-5">
            <Search
                v-model="searchText"
                :placeholder="`Search from ${personaList.length} purpose(s)`"
                @change="handleSearch"
            />
        </div>
        <div
            v-if="searchText && isLoading"
            class="flex items-center justify-center w-full h-full"
        >
            <AtlanIcon icon="Loader" class="animate-spin h-7" />
        </div>
        <template v-else-if="!personaList.length">
            <EmptyView
                :desc="searchText ? `No persona found for '${searchText}'` : ''"
                empty-screen="EmptyDiscover"
            />
        </template>
        <div v-else class="flex-grow px-2 overflow-y-auto divide-y">
            <template v-for="p in personaList" :key="p.guid">
                <PurposeCard :p="p" :classification-list="classificationList" />
            </template>
        </div>
    </template>
</template>

<script setup lang="ts">
    import { computed, Ref, ref, toRefs, watch } from 'vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import PurposeCard from './listCard.vue'
    import Search from '@/common/input/searchAdvanced.vue'
    import usePurposeList from '@/governance/purposes/composables/usePurposeListV2'
    import ErrorView from '@/common/error/index.vue'
    import EmptyView from '@/common/empty/index.vue'

    const { classificationList } = useTypedefData()

    const props = defineProps({
        classificationID: {
            type: String,
            required: true,
        },
    })

    const { classificationID } = toRefs(props)

    const {
        results: personaList,
        searchText,
        handleSearch,
        data,
        isLoading,
        error,
        isReady,
        params,
        mutate,
        filter,
    } = usePurposeList({ asyncOptions: { immediate: false } })

    params.value.set('limit', '100')
    mutate()

    filter.value = {
        tags: {
            $elemMatch: [classificationID.value],
        },
    }

    watch(classificationID, (v) => {
        searchText.value = ''
        personaList.value = []
        filter.value = {
            tags: {
                $elemMatch: [v],
            },
        }
        params.value.set('filter', JSON.stringify(filter.value))
        mutate()
    })
</script>

<style scoped></style>
