<template>
    <div class="flex flex-row m-0 p-0 gtcFilters">
        <div>
            <a-select
                v-model:value="selectedStatus"
                placeholder="Status"
                style="width: 120px"
            >
                <a-select-option
                    v-for="item in StatusList"
                    :key="item.id"
                    :value="item.id"
                    :title="item.label"
                >
                    <span class="align-middle">
                        <!-- <fa
                            :icon="item.icon"
                            :class="item.iconClass"
                            class="mr-1 pushtop"
                        ></fa> -->
                        {{ item.label }}
                    </span>
                </a-select-option>
            </a-select>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'

import { List as StatusList } from '~/constant/status'

export default defineComponent({
    emits: ['filterUpdated'],
    setup(props, { emit }) {
        // const selectedStatus = ref<string[]>([])

        // const statusCriterion = computed(() => ({
        //     condition: "OR",
        //     critetion: selectedStatus.value.map((status) => ({
        //         attributeName: "assetStatus",
        //         attributeValue: status,
        //         operator: "eq"
        //     }))
        // }))
        const selectedStatus = ref<string>('')

        const statusCriterion = computed(() => ({
            condition: "OR",
            criterion: [{
                attributeName: "assetStatus",
                attributeValue: selectedStatus.value,
                operator: "eq"
            }]
        }))
        const entityFilters = computed( () => ({
            condition: "AND",
            criterion: [statusCriterion.value]
        }))

        watch(entityFilters, (newFilters) => {
            console.log(newFilters)

            emit('filterUpdated', newFilters)
        })

        return {
            StatusList,
            selectedStatus,
            statusCriterion,
            entityFilters
        }
    },
})
</script>
<style lang="less">
    .gtcFilters {
        .ant-select-selection-placeholder {
            @apply text-sm leading-5 text-gray-700;
        }

    }
</style>
