<template>
    <div class="flex items-center justify-between px-4 mb-2">
        <SearchAdvanced
            placeholder="Search classifications"
            :autofocus="true"
            v-model:value="queryText"
            class="-mt-1.5"
            size="minimal"
            @change="handleSearchChange"
        >
        </SearchAdvanced>
    </div>
    <a-checkbox-group
        class="w-full px-4"
        v-model:value="localValue"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in filteredList" :key="item.id">
                <div class="status">
                    <a-checkbox
                        :value="item.name"
                        class="inline-flex flex-row-reverse items-center w-full mb-1  atlan-reverse"
                    >
                        <div class="flex items-center">
                            <AtlanIcon
                                icon="Shield"
                                class="text-pink-400"
                            ></AtlanIcon>
                            <span class="mb-0 ml-1 text-gray">
                                {{ item.displayName }}
                            </span>
                        </div>
                    </a-checkbox>
                </div>
            </template>

            <div class="mt-1">
                <a-checkbox
                    :value="null"
                    class="inline-flex flex-row-reverse items-center w-full  atlan-reverse"
                >
                    <component
                        :is="noStatus"
                        class="inline-flex self-center w-auto h-4 mb-0.5"
                    />
                    <span class="mb-0 ml-1 text-gray-500"
                        >No Classification</span
                    >
                </a-checkbox>
            </div>
        </div>
    </a-checkbox-group>
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

    export default defineComponent({
        components: {
            SearchAdvanced,
        },
        props: {
            modelValue: {
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const queryText = ref('')
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { classificationList } = useTypedefData()

            const filteredList = computed(() =>
                classificationList.value.filter((i) =>
                    i.displayName
                        .toLowerCase()
                        .includes(queryText.value.toLowerCase())
                )
            )

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                filteredList,
                localValue,
                noStatus,
                handleChange,

                queryText,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>