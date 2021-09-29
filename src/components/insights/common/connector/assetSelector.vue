<template>
    <a-select
        :value="modelValue"
        style="width: 100%"
        :class="$style.connector"
        @change="handleChange"
        :placeholder="placeholder"
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
    import { defineComponent, ref, watch } from 'vue'
    import useAssetList from '~/composables/bots/useAssetList'

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
                required: false,
            },
            filters: {
                type: Object,
                required: false,
            },
            placeholder: {
                type: String,
                required: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const now = ref(true)

            const initialBody = {
                typeName: props.typeName,
                limit: 100,
                offset: 0,
                entityFilters: props.filters,
                attributes: ['name', 'displayName'],
                sortBy: 'Asset.name.keyword',
                aggregationAttributes: ['__typeName.keyword'],
                sortOrder: 'ASCENDING',
            }

            watch(
                () => props.filters,
                () => {
                    initialBody.entityFilters = props.filters
                    replaceBody(initialBody)
                }
            )

            const { list, replaceBody, selfAssetTypeMap } = useAssetList(
                now,
                initialBody.typeName,
                initialBody,
                `selector_${initialBody.typeName}`
            )

            const handleChange = (checkedValues: string) => {
                emit('update:modelValue', checkedValues)
                console.log(checkedValues, 'cjhecked')
                emit('change', checkedValues)
            }

            return {
                list,
                handleChange,
                selfAssetTypeMap,
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
