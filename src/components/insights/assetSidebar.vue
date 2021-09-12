<template>
    <div class="w-full h-full placeholder">
        <div class="flex items-center justify-between w-full p-3">
            <span
                v-if="activeTab && activeTab?.assetSidebar"
                class="font-bold text-gray"
            >
                {{ activeTab.assetSidebar.title }}
            </span>
            <span
                class="flex items-center justify-center"
                @click="() => closeAssetSidebar(activeTab)"
            >
                <fa icon="fal times" class="mb-0 text-lg cursor-pointer" />
            </span>
        </div>
        <div class="flex flex-col items-center justify-center w-full h-full">
            <p>Asset Sidebar</p>
            <p>Tab - {{ activeTab.label }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {
            activeTab: {
                type: Object as PropType<activeInlineTabInterface>,
                required: true,
            },
        },
        emits: ['closeAssetSidebar'],
        setup(props, { emit }) {
            const { activeTab } = toRefs(props)
            const closeAssetSidebar = (activeTab: activeInlineTabInterface) => {
                emit('closeAssetSidebar', activeTab)
            }
            return {
                activeTab,
                closeAssetSidebar,
            }
        },
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
