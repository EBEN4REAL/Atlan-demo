<template>
    <a-select
        ref="inputRef"
        v-model:value="localValue"
        placeholder="Users"
        class="w-full center-arrow"
        :show-search="true"
        :mode="multiple ? 'multiple' : null"
        :options="finalList"
        :filter-option="() => true"
        @change="handleChange"
        @click="
            () => {
                if (finalList.length < 2) mutate()
            }
        "
        @select="resetFilter"
        @search="handleSearch"
    >
        <template #option="item">
            <div class="flex">
                <div class="">
                    {{ item.alias || item.name }}
                </div>
            </div>
        </template>

        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu"> </v-nodes>
            <div class="px-2 pt-2">
                <div class="flex justify-center">
                    <AtlanIcon
                        v-if="isLoading"
                        icon="Loader"
                        class="animate-spin"
                    />
                </div>
                <div class="flex items-end justify-between">
                    <span v-if="list?.length" class="text-xs text-gray-500">
                        {{ list?.length }} of {{ filterTotal }}
                    </span>
                    <span
                        v-if="list?.length < filterTotal"
                        class="flex items-center text-xs justify-center py-0.5 cursor-pointer text-primary hover:underline"
                        @click="loadMore"
                        @mousedown="(e) => e.preventDefault()"
                    >
                        load more...
                    </span>
                </div>
            </div>
        </template>

        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" />
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, toRefs, computed } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetGroups from '~/composables/group/useFacetGroups'

    export default defineComponent({
        name: 'GroupsSelect',
        components: { VNodes: (_, { attrs }) => attrs.vnodes },
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                type: Array,
                required: false,
                default: () => [],
            },
            multiple: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { multiple } = toRefs(props)
            const localValue: any = ref(modelValue.value)

            // // set proper default value
            // if (multiple.value && !localValue.value) localValue.value = []
            // else if (!localValue.value) localValue.value = ''

            const {
                list,
                handleSearch,
                total,
                resetFilter,
                mutate,
                isLoading,
                filterTotal,
                loadMore,
            } = useFacetGroups()

            watch(
                () => props.queryText,
                () => {
                    handleSearch(props.queryText)
                }
            )

            const finalList = computed(() =>
                (list?.value ?? []).map((g) => ({
                    ...g,
                    value: g.alias,
                    key: g.name,
                    label: g.name,
                }))
            )

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const inputRef = ref()

            const focus = () => {
                inputRef.value.focus()
            }

            return {
                focus,
                inputRef,
                loadMore,
                filterTotal,
                isLoading,
                mutate,
                resetFilter,
                list,
                finalList,
                handleSearch,
                total,
                localValue,
                handleChange,
            }
        },
    })
</script>
