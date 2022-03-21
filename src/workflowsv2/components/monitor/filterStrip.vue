<template>
    <a-drawer
        :visible="drawerFilter"
        :mask="false"
        :placement="'left'"
        :width="240"
        :closable="false"
        :class="'drawer-filter-runs'"
    >
        <div
            class="relative h-full pb-10 overflow-scroll bg-gray-50"
            :class="$style['request-filter-wrapper']"
        >
            <div
                v-if="drawerFilter"
                class="close-btn-sidebar button-close-drawer-run"
                @click="drawerFilter = false"
            >
                <AtlanIcon icon="Add" class="text-white" />
            </div>
            <span class="text-xl">Filters go here</span>
        </div>
    </a-drawer>
    <div class="flex items-center w-full h-16 px-5 bg-white gap-x-4">
        <AtlanButton2
            color="secondary"
            prefix-icon="FilterFunnel"
            label="Filters"
            @click="drawerFilter = !drawerFilter"
        />
        <PackageSelector v-model:value="packageId" />
        <WorkflowSelector
            v-model:value="workflowId"
            :package-name="packageId"
            :disabled="!packageId"
        />
        <TabbedDateRangePicker v-model:value="runDateRange" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import PackageSelector from '~/workflowsv2/components/common/packageSelector.vue'
    import WorkflowSelector from '~/workflowsv2/components/common/workflowSelector.vue'
    import TabbedDateRangePicker from '~/workflowsv2/components/common/tabbedDateRangePicker.vue'

    export default defineComponent({
        name: 'FilterStrip',
        components: {
            PackageSelector,
            WorkflowSelector,
            TabbedDateRangePicker,
        },
        props: {},
        emits: [],
        setup() {
            const runDateRange = ref('Today')
            const drawerFilter = ref(false)
            const packageId = ref(undefined)
            const workflowId = ref(undefined)

            return { runDateRange, drawerFilter, packageId, workflowId }
        },
    })
</script>
<style lang="less" scoped>
    .drawer-filter-runs {
        .ant-drawer-content-wrapper {
            width: 240px !important;
        }
    }
    .button-close-drawer-run {
        left: 260px !important;
        top: 12px;
    }
</style>

<style lang="less" module>
    .request-filter-wrapper {
        :global(.filter-head) {
            background: inherit !important;
            height: 52px;
            @apply pt-4 !important;
        }
    }
</style>
