<template>
    <a-select
        :value="modelValue"
        style="width: 100%; border-radius: 8px"
        :class="$style.connector"
        @change="handleChange"
        :placeholder="placeholder"
        :disabled="disabled"
        :options="dropdownOption"
        :loading="isLoading"
        show-search
        filter-option
        allow-clear
    >
        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />

            <a-divider style="margin: 4px 0" />
            <div class="px-3">
                {{ list.length }} of {{ totalCount }} &nbsp;{{ typeName }}
            </div>
        </template>
        <template #suffixIcon>
            <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
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
            filters: {
                type: Object,
                required: false,
            },
            placeholder: {
                type: String,
                required: true,
            },
            typeName: {
                type: String,
                required: false,
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
                dsl: filters.value,
                attributes: ['name', 'displayName'],
            }

            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )

            const totalCount = computed(() => data.value?.approximateCount || 0)

            watch(
                [disabled, filters],
                () => {
                    if (!disabled.value) {
                        initialBody.dsl = filters.value
                        replaceBody(initialBody)
                    }
                },
                { immediate: true }
            )

            const handleChange = (checkedValues: string) => {
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            const dropdownOption = computed(() =>
                list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    value: ls.attributes.qualifiedName,
                }))
            )

            return {
                typeName,
                list,
                handleChange,
                totalCount,
                data,
                isLoading,
                dropdownOption,
            }
        },
    })
</script>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
            @apply rounded-lg !important;
        }
    }
</style>
