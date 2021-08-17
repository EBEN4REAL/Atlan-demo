<template>
    <div class="flex flex-row m-0 p-0 gtcFilters">
        <div>
            <a-select
                ref="select"
                v-model:value="selectedStatus"
                placeholder="Status"
                style="width: 120px"
                mode="tags"
            >
                <a-select-option
                    v-for="item in StatusList"
                    :key="item.id"
                    :value="item.id"
                    :title="item.label"
                >
                    <span class="align-middle">
                        <fa
                            :icon="item.icon"
                            :class="item.iconClass"
                            class="mr-1 pushtop"
                        ></fa
                        >{{ item.label }}
                    </span>
                </a-select-option>
            </a-select>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useTimeAgo } from '@vueuse/core'

import { useUserPreview } from '~/composables/user/showUserPreview'

import { List as StatusList } from '~/constant/status'

export default defineComponent({
    setup() {
        const selectedStatus = ref<string[]>([])

        const statusCriterion = computed(() => ({
            condition: "OR",
            critetion: selectedStatus.value.map((status) => ({
                attributeName: "assetStatus",
                attributeValue: status,
                operator: "eq"
            }))
        }))

        const entityFilters = {
            condition: "AND",
            criterion: [statusCriterion.value]
        }

        return {
            StatusList,
            selectedStatus,
            statusCriterion
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
