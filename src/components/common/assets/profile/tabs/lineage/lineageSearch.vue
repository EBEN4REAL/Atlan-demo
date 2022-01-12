<template>
    <div class="search">
        <!-- Search Input -->
        <a-input
            ref="searchBar"
            class="search-input"
            :value="query"
            :enter-button="null"
            :suffix="null"
            placeholder="Search"
            allow-clear
            @change="setQuery"
            @blur="onBlur"
            @focus="onFocus"
        />
        <!-- Search Results -->
        <div v-if="showResults" class="search-results">
            <div v-if="query" class="search-results__count">
                {{ filteredItems.length }} results found
            </div>
            <div
                v-for="(item, index) in filteredItems"
                :key="index"
                class="search-results__item"
                :class="{ selected: searchItem === item.guid }"
                @click="setSearchItem(item)"
            >
                <img
                    v-if="sourceImg(item)"
                    class="h-4"
                    :src="sourceImg(item)"
                />
                <div v-else class="w-4 h-4 bg-gray-300" />
                <span>{{ item.displayText || item.attributes.name }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        ref,
        inject,
        computed,
        watch,
        onMounted,
        nextTick,
    } from 'vue'

    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { getNodeSourceImage, getSource } from './util'

    export default defineComponent({
        components: { SearchAndFilter },
        setup() {
            /** DATA */
            const query = ref('')
            const searchItem = ref('')
            const showResults = ref(false)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)

            /** INJECTIONS */
            const searchItems = inject('searchItems')
            const onSelectAsset = inject('onSelectAsset')

            /** COMPUTED */
            const filteredItems = computed(() => {
                if (!query.value) return []
                return searchItems.value.filter((i) =>
                    (i.displayText || i.attributes.name)
                        .toLowerCase()
                        .includes(query.value.toLowerCase())
                )
            })

            /** METHODS */
            const setQuery = (e) => {
                query.value = e.target.value
            }

            const setSearchItem = (item) => {
                searchItem.value = item.guid
                onSelectAsset(item, true)
            }

            const onBlur = () => {
                setTimeout(() => {
                    showResults.value = false
                }, 500)
            }

            const onFocus = () => {
                showResults.value = true
            }

            const sourceImg = (entity) => {
                const source = getSource(entity)
                return getNodeSourceImage[source]
            }
            /** WATCHERS */
            watch(query, (val) => {
                if (val) showResults.value = true
                else showResults.value = false
            })

            onMounted(async () => {
                await nextTick()
                searchBar.value?.focus()
            })
            return {
                query,
                searchItems,
                filteredItems,
                searchItem,
                showResults,
                setQuery,
                setSearchItem,
                onBlur,
                onFocus,
                searchBar,
                sourceImg,
            }
        },
    })
</script>

<style lang="less" scoped>
    .search {
        @apply mr-4;
        position: relative;
        z-index: 999;

        &-input {
            width: 13rem !important;
            z-index: 999;
            border: 0 !important;
            padding: 0 !important;
            outline: 0 !important;
            box-shadow: unset !important;
        }

        &-results {
            position: absolute;
            background: white;
            width: 100%;
            overflow: scroll;
            max-height: 300px;
            border: 1px solid #f1f1f1;
            box-shadow: 0 2rem 2rem rgba(0, 0, 0, 0.08);
            z-index: 999;

            &__count {
                padding: 0 16px;
                margin-top: 12px;
                margin-bottom: 3px;
                text-transform: uppercase;
                font-size: 0.8rem;
                opacity: 0.7;
            }

            &__item {
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                text-transform: lowercase;
                column-gap: 8px;

                & > span:first-child {
                    margin-right: 10px;
                }

                & > span:last-child {
                    width: 14rem;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                &:hover {
                    background: #e7f4ff;
                }

                &.selected {
                    background: #e7f4ff;
                }
            }
        }
    }
</style>
