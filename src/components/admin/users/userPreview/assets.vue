<template>
    <div>
        <div class="mb-2 text-base font-bold text-gray-500">Assets Owned</div>
        <div class="flex flex-col h-full border rounded-lg">
            <!-- <AssetsWrapper
                class-name="border"
                :selected-user="props.selectedUser"
                :selected-group="props.selectedGroup"
            /> -->
            <!-- TODO: Change it  -->
            WIP
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AssetsWrapper from '@common/assets/index.vue'

    export default defineComponent({
        name: 'Assets',
        components: {
            AssetsWrapper,
        },
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
        setup(props) {
            return {
                props,
            }
        },
    })
</script>

<style lang="less" scoped>
    .asset-list-height {
        max-height: calc(100vh - 23.5rem);
    }
</style>
