<template>
    <a-select
        :value="modelValue"
        style="width: 100%"
        :class="$style.connector"
        @change="handleChange"
        :placeholder="placeholder"
        :disabled="disabled"
        show-search
        filter-option
        allow-clear
    >
        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0" />
            <div class="px-3">
                {{ list.length }} of {{ selfAssetTypeMap[typeName] }}
                {{ typeName }}
            </div>
        </template>
        <template #suffixIcon>
            <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
        </template>
        <template v-for="options in list" :key="options.guid">
            <a-select-option :value="options.attributes.qualifiedName">
                <div class="flex flex-col">
                    {{
                        options.attributes?.displayName ||
                        options.attributes?.name
                    }}
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, toRefs, computed } from 'vue'
    import { useAssetListing } from '@/discovery/useAssetListing'

    export default defineComponent({
        name: 'AssetSelector',
        components: {
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            modelValue: {
                type: String,
                required: false,
            },
            typeName: {
                type: String,
                required: true,
            },
            filters: {
                type: Object,
                required: false,
            },
            placeholder: {
                type: String,
                required: true,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { disabled, filters, typeName } = toRefs(props)

            const initialBody = {
                typeName: typeName.value,
                limit: 100,
                offset: 0,
                entityFilters: filters.value,
                attributes: ['name', 'displayName'],
                sortBy: 'Asset.name.keyword',
                aggregationAttributes: ['__typeName.keyword'],
                sortOrder: 'ASCENDING',
            }

            const { list, replaceBody, data } = useAssetListing(
                initialBody.typeName,
                false
            )

            const selfAssetTypeMap = computed(
                () => data.value?.aggregations?.['__typeName.keyword'] || 0
            )

            watch(
                [disabled, filters],
                () => {
                    if (!disabled.value) {
                        initialBody.entityFilters = filters.value
                        replaceBody(initialBody)
                    }
                },
                { immediate: true }
            )

            const handleChange = (checkedValues: string) => {
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            return {
                list,
                handleChange,
                selfAssetTypeMap,
                data,
            }
        },
        data() {
            return {}
        },
        computed: {},
    })
</script>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }
    }
</style>
