<template>
    <div
        v-if="isLoading && !searchText"
        class="flex items-center justify-center w-full h-full"
    >
        <AtlanLoader class="h-7" />
    </div>
    <template v-else-if="error">
        <ErrorView />
    </template>
    <template v-else-if="!personaList.length && !filter.displayName">
        <!-- !filter.displayName instead of !searchText -> leakage logic due to debounce, find better way to solve }} -->
        <EmptyView
            empty-screen="IllustrationPurposeDemo"
            class="text-center"
            desc="No purposes are linked to this classification"
            image-class="w-24 h-20"
            desc-class="w-40 mt-8 text-sm text-gray-500"
        />
    </template>
    <template v-else>
        <div class="mb-5">
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
            <AtlanLoader class="h-7" />
        </div>
        <template v-else-if="!personaList.length">
            <EmptyView
                :desc="searchText ? `No persona found for '${searchText}'` : ''"
                empty-screen="NoAssetsFound"
                image-class="h-44"
            />
        </template>
        <div v-else :class="customClasses">
            <template v-for="p in personaList" :key="p.guid">
                <PurposeCard
                    :p="p"
                    :classification-list="classificationList"
                    :padding-x="paddingX"
                    :padding-y="paddingY"
                    class="border-b"
                />
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
        paddingX: {
            type: Number,
            required: false,
            default: 10,
        },
        paddingY: {
            type: Number,
            required: false,
            default: 8,
        },
        customClasses: {
            type: String,
            required: false,
            default: 'flex-grow px-2 overflow-y-auto',
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
    filter.value = {
        tags: {
            $elemMatch: [classificationID.value],
        },
    }
    params.value.set('filter', JSON.stringify(filter.value))

    mutate()

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
