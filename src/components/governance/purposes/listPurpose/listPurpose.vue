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
    <template v-else-if="!personaList.length && !searchText">
        <EmptyView
            class="text-center"
            headline="There is no purpose linked to this classification"
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
                :desc="`No persona found for '${searchText}'`"
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
    import { computed, ref, toRefs, watch } from 'vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import PurposeCard from './listCard.vue'
    import Search from '@/common/input/searchAdvanced.vue'
    import usePurposeList from '@/governance/purposes/composables/usePurposeListV2'
    import ErrorView from '@/common/error/index.vue'
    import EmptyView from '@/common/empty/index.vue'

    const { classificationList } = useTypedefData()
    import { useDebounceFn } from '@vueuse/core'

    const props = defineProps({
        classificationID: {
            type: String,
            required: true,
        },
    })

    const { classificationID } = toRefs(props)

    const params = ref({
        limit: 100,
        filter: {
            tags: {
                $elemMatch: [classificationID.value],
            },
        },
    })

    const searchText = ref('')

    const {
        results: personaList,
        data,
        isLoading,
        error,
        isReady,
        mutate,
    } = usePurposeList(params, { asyncOptions: { immediate: true } })

    watch(classificationID, (v) => {
        searchText.value = ''
        personaList.value = []
        params.value = {
            limit: 100,
            filter: {
                tags: {
                    $elemMatch: [classificationID.value],
                },
            },
        }
        mutate()
    })

    const handleSearch = useDebounceFn(() => {
        personaList.value = []
        if (searchText.value) {
            params.value.filter = {
                ...params.value.filter,
                displayName: { $ilike: `%25${searchText.value}%25` },
            }
        } else delete params.value.filter?.displayName
        mutate()
    }, 700)
</script>

<style scoped></style>
