<template>
    <a-select
        v-model:value="value"
        placeholder="Select Assets"
        style="width: 100%"
        :allow-clear="true"
        show-search
        :default-active-first-option="false"
        :show-arrow="false"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :options="list"
        class="px-0 text-sm text-gray-500 bg-transparent border-none  focus:outline-none"
        @search="handleSearch"
        @change="handleChange"
    >
        <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
        </template>

        <template #option="{ data }">
            <!-- <div class="">
                <div
                    class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer text-md text-primary overflow-ellipsis whitespace-nowrap"
                >
                    {{ title(data) }}
                </div>
                <div class="flex items-center">
                    <img
                        :src="getConnectorImage(data)"
                        class="h-3 mr-1 mb-0.5"
                    />
                    <div class="text-sm tracking-tight text-gray-500 uppercase">
                        {{ data.typeName }}
                    </div>
                </div>
            </div> -->
            <AssetCard :item="data" />
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import useAssetSelector from './useAssetSelector'
    import AssetItem from '@/discovery/list/assetItem.vue'
    import AssetCard from './assetCard.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'AssetSelector',
        components: { AssetItem, AssetCard },
        props: {
            multiple: { type: Boolean, default: () => false },
            typeName: { type: String, required: false, default: () => '__all' },
        },
        setup(props, { emit }) {
            const { typeName } = toRefs(props)
            const {
                value,
                handleSearch,
                handleChange,
                list,
                loading: fetching,
            } = useAssetSelector(
                {
                    dependentKey: 'true',
                    typeName,
                },
                emit
            )

            const { title, getConnectorImage } = useAssetInfo()

            return {
                title,
                getConnectorImage,
                value,
                fetching,
                handleSearch,
                handleChange,
                list,
            }
        },
    })
</script>

<style lang="less" module></style>
