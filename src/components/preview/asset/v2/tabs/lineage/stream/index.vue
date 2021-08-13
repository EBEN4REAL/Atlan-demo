<template>
    <div v-if="lineageList">
        <div class="flex items-center justify-between my-3 gap-x-3">
            <a-input
                :value="query"
                size="default"
                :placeholder="`Search ${direction} assets`"
                :class="$style.searchbar"
                @change="searchQuery"
            >
                <template #prefix>
                    <Fa icon="fal search" class="mr-2 text-gray-500" />
                </template>
            </a-input>
            <a-popover
                v-model:visible="isFilterVisible"
                placement="bottomRight"
                trigger="click"
            >
                <template #content>
                    <Preferences />
                </template>

                <div
                    tabindex="0"
                    class="flex items-center px-4 py-1 transition-shadow border border-gray-300 rounded  hover:border-gray-300"
                    @keyup.enter="isFilterVisible = !isFilterVisible"
                >
                    <span> Filters</span>
                    <Fa
                        icon="fas chevron-down"
                        class="ml-1 transition-transform transform"
                        :class="isFilterVisible ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </a-popover>
        </div>
        <div>
            <AssetList :lineage-list="lineageList" />
        </div>
    </div>
    <div v-if="!lineageList || lineageList.length === 0">
        <img :src="emptyScreen" alt="Empty" class="w-3/5 m-auto mt-4" />
        <div class="mt-4 text-sm text-center text-gray">Result is empty</div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, ref, ToRefs, toRefs } from 'vue'
    // Components
    import Preferences from './preferences.vue'
    import AssetList from './assetList.vue'
    // Assets
    import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        components: { Preferences, AssetList },
        props: {
            direction: {
                type: String,
                required: true,
            },
            lineageList: {
                type: Array,
                required: true,
            },
        },
        setup() {
            const isFilterVisible = ref(false)
            const query = ref('')
            const queryInjection = inject('searchQuery')
            const searchQuery = (e) => {
                query.value = e.target.value
                queryInjection(query.value)
            }

            return {
                searchQuery,
                query,
                emptyScreen,
                isFilterVisible,
            }
        },
    })
</script>

<style lang="less" module>
    .searchbar {
        @apply mr-2 border-none rounded;
        @apply bg-gray-300 bg-opacity-50;
        @apply outline-none;
        :global(.ant-input) {
            @apply h-6;
            @apply bg-transparent;
            @apply text-gray-500;
        }
        ::placeholder {
            @apply text-gray-500 opacity-80;
        }
    }
</style>
