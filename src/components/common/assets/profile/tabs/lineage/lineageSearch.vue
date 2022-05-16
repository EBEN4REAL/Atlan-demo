<template>
    <div class="flex flex-col">
        <div class="flex items-center">
            <div class="control-item" @click="showSearch = !showSearch">
                <a-tooltip placement="top" :mouse-enter-delay="0.4">
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
                    @keyup.esc="onEsc"
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
                disable-links
                @click="setSearchItem(item, index)"
            ></AssetItem>
        </div>
    </div>
</template>

<script lang="ts">
    /** VUE */
    import {
        defineComponent,
        Ref,
        ref,
        inject,
        computed,
        watch,
        nextTick,
    } from 'vue'
    import { useDebounceFn, whenever } from '@vueuse/core'

    /** UTILS */
    import { getNodeSourceImage, getSource } from './util'

    /** COMPOSABLES */
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    /** COMPONENTS */
    import AssetItem from '@/common/assets/preview/lineage/list/assetItem.vue'
    import NoResultIllustration from '~/assets/images/illustrations/Illustration_no_search_results.svg'

    /** STORE */
    import useLineageStore from '~/store/lineage'

    export default defineComponent({
        name: 'LineageSearch',
        components: { AssetItem, NoResultIllustration },
        emits: ['select'],
        setup(_, { emit }) {
            /** INITIALIZE */
            const lineageStore = useLineageStore()

            /** DATA */
            const query = ref('')
            const searchItem = ref('')
            const showResults = ref(false)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            const showSearch = ref(false)

            /** INJECTIONS */
            const onSelectAsset = inject('onSelectAsset')

            /** COMPUTED */
            const searchItems = computed(() => {
                const d = lineageStore.getMergedLineageData()
                const g = d.guidEntityMap
                const v = Object.values(g)

                return v
            })
            const filteredItems = computed(() => {
                if (!query.value) return []
                return searchItems.value.filter((i) => {
                    if (i.typeName.includes('vpNode')) return false
                    return (i?.displayText || i?.attributes.name)
                        ?.toLowerCase()
                        ?.includes(query.value.toLowerCase())
                })
            })

            /** METHODS */
            // searchEvent
            const sendSearchEvent = useDebounceFn(() => {
                useAddEvent('lineage', 'search', 'changed', {
                    result_count: filteredItems.value.length,
                    search_query: query.value.toLowerCase(),
                })
            }, 600)

            // sendSearchResultClickEvent
            const sendSearchResultClickEvent = useDebounceFn((item, index) => {
                useAddEvent('lineage', 'search_result', 'clicked', {
                    click_index: index,
                    result_count: filteredItems.value.length,
                    asset_type: item.typeName?.toLowerCase(),
                    connector:
                        item.attributes?.connectorName ||
                        item.attributes?.qualifiedName?.split('/')[1],
                })
            }, 600)

            // setQuery
            const setQuery = (e) => {
                query.value = e.target.value

                if (e.target.value) sendSearchEvent()
            }

            // setSearchItem
            const setSearchItem = (item, index) => {
                searchItem.value = item.guid
                onSelectAsset(item, true)
                emit('select', item.guid)

                sendSearchResultClickEvent(item, index)
            }

            // onBlur
            const onBlur = () => {
                setTimeout(() => {
                    showResults.value = false
                }, 500)

                if (!query.value) showSearch.value = false
            }

            // onFocus
            const onFocus = () => {
                showResults.value = true
            }

            // onEsc
            const onEsc = (e) => {
                e.target.blur()
                showResults.value = false
                showSearch.value = false
            }

            // sourceImg
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
                searchBar,
                showResults,
                showSearch,
                setQuery,
                setSearchItem,
                onBlur,
                onFocus,
                onEsc,
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
