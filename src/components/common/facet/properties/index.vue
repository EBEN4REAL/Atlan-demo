<template>
    <div
        class="flex items-center justify-between px-4 mb-1"
        v-if="filteredList.length > 5"
    >
        <SearchAdvanced
            placeholder="Search classifications"
            :autofocus="true"
            v-model:value="queryText"
            class="-mt-1.5"
            size="minimal"
        >
        </SearchAdvanced>
    </div>

    <div class="flex flex-col w-full px-2 gap-y-1">
        <Popover
            v-for="item in filteredList"
            :key="item.name"
            :trigger="['click']"
            :property="item"
            v-model:conditions="localValue"
            @change="handleChange"
            placement="rightBottom"
            @click="handleClick(item.name)"
        >
            <div
                class="flex items-center justify-between px-2 py-1 rounded  hover:border-primary hover:bg-primary-light"
                :class="
                    activeProperty === item.name
                        ? 'border border-primary bg-primary-light'
                        : ''
                "
            >
                <div class="text-gray-700">
                    {{ item.displayName }}
                </div>
                <div class="text-gray-500">
                    <AtlanIcon icon="CaretRight" class="h-3"></AtlanIcon>
                </div>
            </div>
        </Popover>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRef, toRefs, watch } from 'vue'
    import { certificateList } from '~/constant/certification'
    import noStatus from '~/assets/images/status/nostatus.svg'

    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { useDebounceFn, useVModels } from '@vueuse/core'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { useTypedefStore } from '~/store/typedef'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    import Popover from './popover.vue'

    export default defineComponent({
        components: {
            SearchAdvanced,
            Popover,
            AtlanIcon,
        },
        props: {
            modelValue: {
                required: false,
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

            const { propertyAttributeList } = useCustomMetadataFacet()

            const filteredList = computed(() =>
                item?.value.attributes.filter((i) =>
                    i.displayName
                        .toLowerCase()
                        .includes(queryText.value.toLowerCase())
                )
            )

            const handleClick = (id) => {
                console.log('click', id)
                activeProperty.value = id
            }

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                filteredList,
                localValue,
                noStatus,
                handleChange,
                propertyAttributeList,
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
