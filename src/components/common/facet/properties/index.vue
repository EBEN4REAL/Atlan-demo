<template>
    <div class="w-full">
        <div
            class="flex items-center justify-between px-4"
            v-if="filteredAttributeList.length > 5"
        >
            <SearchAdvanced
                ref="classificationSearchRef"
                v-model="queryText"
                placeholder="Search properties"
                class="-mt-1.5"
                :allowClear="true"
            >
            </SearchAdvanced>
        </div>

        <div class="flex flex-col w-full px-2 mt-1 gap-y-1">
            <Popover
                v-for="attribute in filteredAttributeList"
                :key="attribute.name"
                :trigger="['click']"
                :attribute="attribute"
                v-model="localValue[attribute.name]"
                @change="handleChange"
                placement="rightBottom"
                @click="handleClick(attribute.name)"
            >
                <Item
                    :item="attribute"
                    :condition="localValue[attribute.name]"
                    :activeProperty="activeProperty"
                    @click="handleClick"
                ></Item>
            </Popover>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRef, toRefs, watch } from 'vue'

    import { useVModels } from '@vueuse/core'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'

    import Popover from './popover.vue'
    import Item from './item.vue'

    export default defineComponent({
        components: {
            SearchAdvanced,
            Popover,
            Item,
        },
        props: {
            modelValue: {
                required: false,
                default() {
                    return {}
                },
            },
            item: {
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const queryText = ref('')
            const activeProperty = ref('')
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { item } = toRefs(props)

            const filteredAttributeList = computed(() =>
                item?.value.attributes.filter((i) =>
                    i.displayName
                        .toLowerCase()
                        .includes(queryText.value.toLowerCase())
                )
            )

            const handleClick = (id) => {
                activeProperty.value = id
            }

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                filteredAttributeList,
                localValue,

                handleChange,

                queryText,
                handleClick,
                activeProperty,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>
