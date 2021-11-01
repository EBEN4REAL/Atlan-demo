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
            <span>{{ data.displayText }}</span>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import useAssetSelector from './useAssetSelector'

    export default defineComponent({
        name: 'AssetSelector',
        components: {},
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
            return {
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
