<template>
    <a-checkbox-group
        class="w-full px-4"
        @change="handleChange"
        v-model:value="localFacetMap"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in certificateList" :key="item.id">
                <div class="mb-3 status">
                    <a-checkbox
                        :value="item.id"
                        class="inline-flex flex-row-reverse items-center w-full  atlan-reverse"
                    >
                        <component
                            :is="item.icon"
                            class="inline-flex self-center w-auto h-5 mb-1"
                        />
                        <span class="mb-0 ml-1 text-gray">
                            {{ item.label }}
                        </span>
                    </a-checkbox>
                </div>
            </template>

            <div class="pt-1 border-t border-gray-200">
                <a-checkbox
                    :value="null"
                    class="inline-flex flex-row-reverse items-center w-full  atlan-reverse"
                >
                    <component
                        :is="noStatus"
                        class="inline-flex self-center w-auto h-5 mb-1"
                    />
                    <span class="mb-0 ml-1 text-gray-500">
                        No Certificate
                    </span>
                </a-checkbox>
            </div>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { defineComponent, ref, toRef, toRefs } from 'vue'
    import { certificateList } from '~/constant/certification'
    import noStatus from '~/assets/images/status/nostatus.svg'

    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { useVModels, toRef } from '@vueuse/core'

    export default defineComponent({
        props: {
            facetMap: {
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['change', 'update:facetMap'],
        setup(props, { emit }) {
            const { facetMap } = useVModels(props, emit)

            let initialValue = []
            if (facetMap?.value) {
                initialValue = facetMap?.value
            }

            console.log(initialValue)

            const localFacetMap = ref(initialValue)

            const handleChange = () => {
                facetMap.value = localFacetMap.value
                emit('change')
                useAddEvent('discovery', 'facet', 'changed', {
                    filter_type: 'certificate',
                    count: localFacetMap.value?.length,
                })
            }

            return {
                certificateList,
                localFacetMap,
                handleChange,
                noStatus,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>
