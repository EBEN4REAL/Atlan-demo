<template>
    <teleport to="#overAssetSidebar">
        <a-drawer
            v-model:visible="visible"
            placement="right"
            :get-container="false"
            :class="$style.drawerStyles"
            :closable="false"
            :mask-closable="true"
            :style="{ position: 'absolute' }"
            :content-wrapper-style="{ width: '420px' }"
            :mask="true"
            :mask-style="{
                background: 'rgba(244, 246, 253, 0.9)',
            }"
            :key="data.guid"
            @close="$emit('closeDrawer')"
        >
            <AssetPreview
                :selected-asset="data"
                :isDrawer="true"
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
        },
        emits: ['closeDrawer', 'update'],

        setup(props, { emit }) {
            const { showDrawer } = toRefs(props)

            const visible = ref(false)

            const updateDrawerList = (asset) => {
                emit('update', asset)
            }

            provide('updateDrawerList', updateDrawerList)

            watch(showDrawer, () => (visible.value = showDrawer.value))

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
