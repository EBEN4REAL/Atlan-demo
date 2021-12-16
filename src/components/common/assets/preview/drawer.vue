<template>
    <teleport to="#overAssetSidebar">
        <a-drawer
            v-model:visible="visible"
            placement="right"
            :get-container="false"
            :class="$style.drawerStyles"
            :closable="!showMask"
            :mask-closable="showMask"
            :style="{ position: 'absolute' }"
            :content-wrapper-style="{ width: '420px' }"
            :mask="showMask"
            :key="data?.guid"
            @close="$emit('closeDrawer')"
        >
            <AssetPreview
                :selected-asset="data"
                :isDrawer="true"
                @closeDrawer="$emit('closeDrawer')"
            ></AssetPreview> </a-drawer
    ></teleport>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs, provide } from 'vue'
    import AssetPreview from '@/common/assets/preview/index.vue'

    export default defineComponent({
        components: {
            AssetPreview,
        },
        props: {
            data: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            showDrawer: {
                type: Boolean,
                required: false,
                default() {
                    return {}
                },
            },
            showMask: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['closeDrawer', 'update'],

        setup(props, { emit }) {
            const { showDrawer } = toRefs(props)

            const visible = ref(false)

            const updateDrawerList = (asset) => {
                emit('update', asset)
            }

            provide('updateDrawerList', updateDrawerList)

            watch(showDrawer, () => {
                visible.value = showDrawer.value
            })

            return { visible }
        },
    })
</script>

<style lang="less" module>
    .drawerStyles {
        :global(.ant-drawer-body) {
            @apply h-full !important;
            width: 420px;
        }
        :global(.ant-drawer-content-wrapper) {
            width: 420px;
        }
    }
</style>
