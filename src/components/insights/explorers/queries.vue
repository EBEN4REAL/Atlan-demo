<template>
    <div class="flex flex-col items-center w-full h-full p-3 bg-white">
        <div class="w-full h-32 mb-3 rounded placeholder"></div>
        <template v-for="query in savedQueries" :key="query.id">
            <div
                class="flex items-center justify-center w-full px-2 py-2 mb-3 rounded cursor-pointer "
                @click="() => openSavedQueryInNewTab(query)"
                :class="
                    isSavedQueryOpened(query)
                        ? 'active-placeholder'
                        : 'placeholder'
                "
            >
                {{ query.label }}
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, inject, Ref } from 'vue'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {},
        emits: ['openSavedQueryInNewTab'],
        setup(props, { emit }) {
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const savedQueries: SavedQueryInterface[] = [
                {
                    id: '1x',
                    label: ' Saved Query 1',
                    editor: 'Saved Query 1',
                    result: 'Saved Query 1',
                },
                {
                    id: '2x',
                    label: 'Saved Query 2',
                    editor: 'Saved Query 2',
                    result: 'Saved Query 2',
                },
                {
                    id: '3x',
                    label: 'Saved Query 3',
                    editor: 'Saved Query 3',
                    result: 'Saved Query 3',
                },
            ]

            const openSavedQueryInNewTab = (
                savedQuery: SavedQueryInterface
            ) => {
                emit('openSavedQueryInNewTab', savedQuery)
            }
            const isSavedQueryOpened = (savedQuery: SavedQueryInterface) => {
                let bool = false
                inlineTabs.value.forEach((tab) => {
                    if (tab.key === savedQuery.id) bool = true
                })
                return bool
            }
            return {
                isSavedQueryOpened,
                openSavedQueryInNewTab,
                savedQueries,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .active-placeholder {
        @apply bg-primary text-white;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
