<template>
    <a-select
        :value="modelValue"
        :show-search="true"
        :filter-option="true"
        style="width: 100%"
        :allow-clear="true"
        @change="handleChange"
        :placeholder="placeholder"
        @search="handleSearch"
    >
        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0" />
            <div class="px-3">
                {{ list.length }} of {{ selfAssetTypeMap[typeName] }}
                {{ typeName }}
            </div>
        </template>
        <template v-for="options in list" :key="options.guid">
            <a-select-option :value="options.attributes.qualifiedName">
                <div class="flex flex-col">
                    {{
                        options.attributes?.displayName ||
                        options.attributes?.name
                    }}
                    <!-- <div>
            {{ options.name }}
            <span v-if="options.user_count">({{ options.user_count }})</span>
          </div> -->
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import useAssetList from '~/composables/bots/useAssetList'

    export default defineComponent({
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
                entityFilters: {},
                attributes: ['name', 'displayName'],
                sortBy: 'Asset.name.keyword',
                aggregationAttributes: ['__typeName.keyword'],
                sortOrder: 'ASCENDING',
            }
            initialBody.entityFilters = props.filters

            // watch(
            //   () => props.filters,
            //   () => {
            //     initialBody.entityFilters = props.filters;
            //     replaceBody(initialBody);
            //   }
            // );

            const { list, replaceBody, selfAssetTypeMap } = useAssetList(
                now,
                initialBody.typeName,
                initialBody,
                `selector_${initialBody.typeName}`
            )
            const handleChange = (checkedValues: string) => {
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            const handleSearch = useDebounceFn((val) => {
                initialBody.query = val
                replaceBody(initialBody)
            }, 100)

            return {
                list,
                handleChange,
                handleSearch,
                selfAssetTypeMap,
            }
        },
        data() {
            return {}
        },
        computed: {},
    })
</script>

<style lang="less" module></style>
