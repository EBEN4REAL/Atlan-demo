<template>
    <div>
        <div class="mb-2 text-base font-bold text-gray-dark">Assets Owned</div>
        <div class="flex flex-col h-full border rounded-lg">
            <AssetsWrapper
                className="border"
                :selectedUser="props.selectedUser"
                :selectedGroup="props.selectedGroup"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, reactive, ref, watch } from 'vue';
    import AssetsWrapper from '@common/assets/index.vue';

    export default {
        name: 'Assets',
        props: {
            selectedUser: {
                type: Object,
                default: {},
            },
            selectedGroup: {
                type: Object,
                default: {},
            },
        },
        components: {
            AssetsWrapper,
        },
        setup(props) {
            return {
                props,
            };
        },
    };
</script>

<style lang="less" scoped>
    .asset-list-height {
        max-height: calc(100vh - 23.5rem);
    }
</style>
