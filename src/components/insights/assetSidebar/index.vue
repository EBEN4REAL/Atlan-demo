<template>
    <div class="w-full h-full placeholder">
        <div class="flex items-center justify-between w-full p-3">
            <span
                v-if="activeInlineTab && activeInlineTab?.assetSidebar"
                class="font-bold text-gray"
            >
                {{ activeInlineTab.assetSidebar.title }}
            </span>
            <span
                class="flex items-center justify-center"
                @click="() => closeAssetSidebar(activeInlineTab)"
            >
                <fa icon="fal times" class="mb-0 text-lg cursor-pointer" />
            </span>
        </div>
        <div class="flex flex-col items-center justify-center w-full h-full">
            <p>Asset Sidebar</p>
            <p>Tab - {{ activeInlineTab.label }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {},
        emits: ['closeAssetSidebar'],
        setup(props, { emit }) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            /*
                @params - activeInlineTab: activeInlineTabInterface
             */
            const closeAssetSidebar = inject('closeAssetSidebar') as Function
            return {
                activeInlineTab,
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
