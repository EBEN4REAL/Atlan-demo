<template>
    <div class="lineage-control header">
        <div>
            <AtlanIcon icon="Search" class="mr-5"></AtlanIcon>
        </div>
        <div>
            <AtlanIcon icon="Filter" class="mr-5"></AtlanIcon>
        </div>
        <a-dropdown>
            <a class="flex items-center mr-3 text-gray-500" @click.prevent>
                {{ currDepth }}
                <AtlanIcon
                    icon="CaretRight"
                    class="ml-1 transform rotate-90"
                ></AtlanIcon>
            </a>
            <template #overlay>
                <a-menu>
                    <a-menu-item v-for="item in lineageDepths" :key="item.id">
                        <a href="javascript:;">{{ item.label }}</a>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-divider type="vertical" />
        <div>
            <AtlanIcon icon="ImpactedAssets" class="ml-3"></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, watch, inject, computed } from 'vue'
    // Components
    // import LineageSearch from './lineageSearch.vue'
    // import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'LineageHeader',
        // components: {
        //     LineageSearch,
        //     AtlanBtn,
        // },
        props: {
            selectedNodeType: {
                type: String,
                required: true,
            },
        },
        emits: ['showProcess', 'showImpactedAssets', 'showAddLineage'],
        setup(_, { emit }) {
            const depth = inject('depth')
            const direction = inject('direction')
            const control = inject('control')

            const showProcess = ref(false)
            const lineageDepths = [
                { id: 1, label: 'Depth 1' },
                { id: 2, label: 'Depth 2' },
                { id: 3, label: 'Depth 3' },
                { id: 21, label: 'Maximum' },
            ]
            const lineageDirections = [
                { id: 'BOTH', label: 'Both Direction' },
                { id: 'INPUT', label: 'Upstream' },
                { id: 'OUTPUT', label: 'Downstream' },
            ]
            const currDepth = computed(
                () => lineageDepths.find((x) => x.id === depth.value)?.label
            )

            watch(showProcess, (val) => {
                emit('showProcess', val)
            })

            return {
                emit,
                currDepth,
                depth,
                direction,
                control,
                showProcess,
                lineageDepths,
                lineageDirections,
            }
        },
    })
</script>

<style lang="less">
    @primary: #428bca;

    //  Ant design
    .ant-select-selection:hover {
        border-color: @primary !important;
    }

    .ant-select-focused .ant-select-selection,
    .ant-select-selection:focus,
    .ant-select-selection:active {
        border-color: @primary !important;
        box-shadow: 0 0 0 2px lighten(@primary, 30%) !important;
    }

    .ant-dropdown-menu-item:hover,
    .ant-dropdown-menu-submenu-title:hover {
        background-color: unset;
    }
</style>
