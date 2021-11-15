<template>
    <div class="search">
        <!-- Search Input -->
        <a-input-search
            class="search-input"
            :value="query"
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
                @click="setSearchItem(item.guid)"
            >
                <!-- <fa
                    :icon="getNodeTypeIcon[item.typeName]"
                    :class="getNodeTypeIcon[item.typeName]"
                ></fa> -->
                <span class="w-6 h-4 bg-gray-300"></span>
                <span>{{ item.displayText }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, inject, computed, watch } from 'vue'

    // Util
    import { getNodeTypeIcon } from './util.js'

    export default defineComponent({
        setup() {
            /** DATA */
            const query = ref('')
            const searchItem = ref('')
            const showResults = ref(false)

            /** INJECTIONS */
            const searchItems = inject('searchItems')
            const selectSearchItem = inject('selectSearchItem')

            /** COMPUTED */
            const filteredItems = computed(() => {
                if (!query.value) return []
                // console.log('searchItems:', searchItems.value)
                return searchItems.value.filter((i) =>
                    i.displayText
                        .toLowerCase()
                        .includes(query.value.toLowerCase())
                )
            })

            /** METHODS */
            const setQuery = (e) => {
                query.value = e.target.value
            }

            const setSearchItem = (guid) => {
                searchItem.value = guid
                selectSearchItem(guid)
            }

            const onBlur = () => {
                setTimeout(() => {
                    showResults.value = false
                }, 500)
            }

            const onFocus = () => {
                showResults.value = true
            }

            /** WATCHERS */
            watch(query, (val) => {
                if (val) showResults.value = true
                else showResults.value = false
            })

            return {
                query,
                searchItems,
                filteredItems,
                showSearchResults: false,
                getNodeTypeIcon,
                searchItem,
                showResults,
                setQuery,
                setSearchItem,
                onBlur,
                onFocus,
            }
        },
    })
</script>

<style lang="less" scoped>
    .search {
        position: relative;
        z-index: 999;

        &-input {
            width: 16rem !important;
            z-index: 999;
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