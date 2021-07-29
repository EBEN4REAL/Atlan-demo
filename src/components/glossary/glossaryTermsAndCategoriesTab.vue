<template>
    <div class="">
        <div class="mb-4">
            <a-input-search
                v-model:value="searchQuery"
                :placeholder="`Search ${all.length} assets...`"
                class="w-80"
                @change="onSearch"
            ></a-input-search>
        </div>
        <div class="flex flex-row w-full">
            <div class="w-full border-r">
                <a-tabs type="card" default-active-key="1" class="border-0">
                    <a-tab-pane key="1" :tab="`All (${all.length})`">
                        <div v-for="asset in all" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-50': true }"
                                :entity="asset"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" :tab="`Terms (${terms.length})`">
                        <div v-for="asset in terms" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-50': true }"
                                :entity="asset"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane
                        key="3"
                        :tab="`Categories (${categories.length})`"
                    >
                        <div v-for="asset in categories" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-50': true }"
                                :entity="asset"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <!-- <div v-if="selectedEntity?.guid" class="w-1/3">
                <Overview
                    :item="selectedEntity"
                    :selectedAssetData="selectedEntity"
                ></Overview>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import useGtcSearch from '~/composables/glossary/useGtcSearch'

import AssetPreview from '@/preview/asset/index.vue'
import Overview from '@/preview/asset/tabs/overview/index.vue'

import GtcEntityCard from './gtcEntityCard.vue'

interface Proptype {
    qualifiedName: string
}

export default defineComponent({
    components: { GtcEntityCard, AssetPreview, Overview },
    props: {
        qualifiedName: {
            type: String,
            required: true,
            default: '',
        },
    },
    setup(props: Proptype) {
        const name = computed(() => props.qualifiedName ?? '')
        const searchQuery = ref<string>()

        const { assets, error, isLoading, fetchAssets } = useGtcSearch()

        const selectedEntity = ref()

        const onEntitySelect = (entity) => {
            selectedEntity.value = entity
        }

        const terms = computed(
            () =>
                assets.value?.entities?.filter(
                    (entity) => entity.typeName === 'AtlasGlossaryTerm'
                ) ?? []
        )
        const categories = computed(
            () =>
                assets.value?.entities?.filter(
                    (entity) => entity.typeName === 'AtlasGlossaryCategory'
                ) ?? []
        )
        const all = computed(() => assets.value?.entities ?? [])
        onMounted(() => {
            fetchAssets(name.value ?? '')
        })

        watch(name, (newName) => {
            fetchAssets(newName)
        })

        watch(searchQuery, (newQuery) => {
            fetchAssets(name.value, `*${newQuery}*`)
        })

        const onSearch = useDebounceFn(() => {
            fetchAssets(name.value, `*${searchQuery.value}*`)
        }, 400)

        return {
            name,
            searchQuery,
            assets,
            all,
            terms,
            categories,
            onSearch,
            onEntitySelect,
            selectedEntity,
        }
    },
})
</script>
<style lang="less">
.secondaryHeading {
    @apply tracking-widest text-xs text-gray-400 leading-5;
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>