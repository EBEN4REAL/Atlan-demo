<template>
    <a-dropdown :trigger="['click']">
        <AtlanIcon
            icon="KebabMenu"
            class="w-4 h-4 my-auto -mr-1.5 outline-none pl-2"
            :class="item?.selected ? 'tree-light-color' : 'bg-gray-light-color'"
        />
        <template #overlay>
            <a-menu>
                <a-menu-item
                    :class="
                        readOnly
                            ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                            : ''
                    "
                >
                    <div class="flex items-center h-8">
                        <AtlanIcon
                            icon="AddAssetName"
                            class="w-4 h-4 my-auto mr-1.5"
                        ></AtlanIcon>
                        <span>Select</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        components: {},
        props: {},
        setup(props) {},
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
