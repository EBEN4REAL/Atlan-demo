<template>
    <div class="flex flex-col">
        <div class="flex items-center">
            <div class="control-item" @click="showSearch = !showSearch">
                <a-tooltip placement="top" mouseEnterDelay="0.4">
                    <template #title>
                        <span>search graph</span>
                    </template>
                    <AtlanIcon
                        icon="Search"
                        class="mx-1 my-2 outline-none"
                    ></AtlanIcon>
                </a-tooltip>
            </div>

            <div v-if="showSearch" class="search">
                <!-- Search Input -->
                <a-input
                    ref="searchBar"
                    class="search-input"
                    :value="query"
                    :enter-button="null"
                    :suffix="null"
                    :placeholder="`Search ${searchItems?.length} assets`"
                    allow-clear
                    @change="setQuery"
                    @blur="onBlur"
                    @focus="onFocus"
                    @keyup.esc="(e) => e.target.blur()"
                />
            </div>
        </div>

        <!-- Search Results -->
        <div v-if="showResults && query" class="search-results">
            <div v-if="filteredItems.length" class="search-results__count">
                {{ filteredItems.length }} results found
            </div>
            <div v-else class="flex flex-col items-center p-10">
                <NoResultIllustration />
                <span class="text-sm text-center text-gray"
                    >Sorry, we couldn't find the asset you were looking for
                </span>
            </div>

            <AssetItem
                v-for="(item, index) in filteredItems"
                :key="index"
                :class="{ selected: searchItem === item.guid }"
                :item="item"
                class="search-results__item"
                @click="setSearchItem(item)"
                disableLinks
            ></AssetItem>
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
        nextTick,
    } from 'vue'
    import { whenever } from '@vueuse/core'

    import { getNodeSourceImage, getSource } from './util'
    import AssetItem from '@/common/assets/preview/lineage/list/assetItem.vue'
    import NoResultIllustration from '~/assets/images/illustrations/Illustration_no_search_results.svg'

    export default defineComponent({
        components: { AssetItem, NoResultIllustration },
        emits: ['select'],
        setup(_, { emit }) {
            /** DATA */
            const query = ref('')
            const searchItem = ref('')
            const showResults = ref(false)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            const showSearch = ref(false)

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
                emit('select', item.guid)
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

            whenever(showSearch, async () => {
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
                showSearch,
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
            display: flex;
            flex-direction: column;
            position: absolute;
            background: white;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            max-height: 300px;
            border: 1px solid #f1f1f1;
            box-shadow: 0 2rem 2rem rgba(0, 0, 0, 0.08);
            z-index: 999;
            top: 43px;

            &__count {
                padding: 0 16px;
                margin-top: 12px;
                margin-bottom: 3px;
                text-transform: uppercase;
                font-size: 0.8rem;
                opacity: 0.7;
            }

            &__item {
                cursor: pointer;
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
