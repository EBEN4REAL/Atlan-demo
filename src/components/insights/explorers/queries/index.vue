<template>
    <div class="flex flex-col items-center w-full h-full bg-white">
        <div class="w-full h-12 p-4 pb-0 rounded">
            <div class="w-full h-full placeholder"></div>
        </div>
        <div class="w-full my-4 border-b"></div>
        <div class="w-full p-4 pt-0">
            <div class="flex justify-between mb-4 text-gray-500">
                <div class="px-3 py-1 rounded shadow">
                    <span
                        class="mr-4 cursor-pointer hover:text-primary-400"
                        :class="
                            isSelectedType('personal')
                                ? 'font-bold text-primary'
                                : ''
                        "
                        @click="() => onSelectQueryType('personal')"
                        >Personal</span
                    >
                    <span
                        class="cursor-pointer hover:text-primary-400"
                        :class="
                            isSelectedType('all')
                                ? 'font-bold text-primary'
                                : ''
                        "
                        @click="() => onSelectQueryType('all')"
                        >All</span
                    >
                </div>
                <div class="flex items-center">
                    <div class="">
                        <AtlanIcon
                            icon="NewQuery"
                            class="h-4 m-0 mr-4 -mt-0.5 hover:text-primary"
                        />
                    </div>
                    <div class="">
                        <AtlanIcon
                            icon="NewFolder"
                            class="h-4 m-0 -mt-0.5 hover:text-primary"
                        />
                    </div>
                </div>
            </div>
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, Ref, ref } from 'vue'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const savedQueryType: Ref<string> = ref('personal')
            const savedQueries: SavedQueryInterface[] = [
                {
                    id: '1x',
                    label: ' Saved Query 1',
                    editor: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                    result: 'Saved Query 1',
                },

                {
                    id: '2x',
                    label: 'Saved Query 2',
                    editor: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                    result: 'Saved Query 2',
                },
                {
                    id: '3x',
                    label: 'Saved Query 3',
                    editor: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                    result: 'Saved Query 3',
                },
            ]
            const { openSavedQueryInNewTab } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const isSavedQueryOpened = (savedQuery: SavedQueryInterface) => {
                let bool = false
                inlineTabs.value.forEach((tab) => {
                    if (tab.key === savedQuery.id) bool = true
                })
                return bool
            }

            const isSelectedType = (type: string) => {
                return savedQueryType.value === type
            }
            const onSelectQueryType = (type: string) => {
                savedQueryType.value = type
            }
            return {
                savedQueryType,
                savedQueries,
                onSelectQueryType,
                isSelectedType,
                isSavedQueryOpened,
                openSavedQueryInNewTab,
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
