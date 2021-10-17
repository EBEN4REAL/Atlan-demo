<template>
    <a-checkbox-group
        v-model:value="data.checked"
        class="w-full py-1 pb-6"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in list" :key="item.id">
                <div class="mb-3 status">
                    <a-checkbox :value="item.id" class="w-full">
                        <component
                            class="inline-flex self-center w-auto h-4 mb-1"
                            :is="item.icon"
                        />
                        <span class="mb-0 ml-1 text-gray">
                            {{ item.label }}
                        </span>
                    </a-checkbox>
                </div>
            </template>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { Components } from '~/api/atlas/client'
    import { List } from '~/constant/status'
    import { Collapse } from '~/types'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const list = computed(() => List)
            const checkedValues = ref([])
            const { data } = toRefs(props)
            const handleChange = () => {
                emit('change')
                useAddEvent('discovery', 'facet', 'changed', {
                    filter_type: 'status',
                    count: data.value?.checked?.length,
                })
            }

            return {
                data,
                list,
                checkedValues,
                handleChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .status:last-child {
        margin-bottom: 0 !important;
    }
</style>
