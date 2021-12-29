<template>
    <a-drawer
        placement="right"
        :destroy-on-close="true"
        :visible="isVisible"
        :get-container="false"
        :closable="false"
        :mask="false"
        :class="$style.drawerStyle"
        :width="460"
    >
        <div class="relative overflow-x-hidden overflow-y-hidden drawer_height">
            <div class="absolute w-full h-full py-6 bg-white">
                <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                    >Search from your assets</span
                >
                    <Assets
                        :show-filters="false"
                        :static-use="true"
                        :show-aggrs="true"
                        :showCheckBox="true"
                        :preference="preference"
                        :allCheckboxAreaClick="true"
                        :disableHandlePreview="true"
                        :isCache="false"
                        class="asset-list-height"
                        key="all-assets"
                        page="glossary"
                    />
            </div>
        </div>
        <div class="flex items-center justify-end m-2 mt-6 gap-x-2">
            <span class="text-base font-bold text-gray-500"
                >{{ selectedAssetCount || 'No' }} items selected</span
            >
            <AtlanBtn
                size="sm"
                padding="compact"
                color="secondary"
                @click="closeDrawer"
                data-test-id="cancel"
                >Cancel</AtlanBtn
            >
            <AtlanBtn
                size="sm"
                padding="compact"
                data-test-id="save"
                @click="saveAssets"
                >Save</AtlanBtn
            >
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
    } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import Assets from '@/assets/index.vue'


    export default defineComponent({
        name: 'LinkedAssetsDrawer',
        components: {
            Assets,
            AtlanBtn
        },
        props: {
            isVisible: {
                type: Object as PropType<Boolean>,
                required: true,
                default: false
            },
            preference: {
                type: Object,
                required: false,
            },
            selectedAssetCount: {
                type: Number,
                required: true,
            },

        },
        emits: ['closeDrawer', 'saveAssets'],
        setup(props, { emit }) {

            const closeDrawer = () => {
                emit('closeDrawer')
            }
            const saveAssets = () => {
                emit('saveAssets')
            }

            return {
                closeDrawer,
                saveAssets,
            }
        },
    })
</script>

<style lang="less" module>
    .drawerStyle {
        :global(.ant-drawer-body) {
            overflow-y: hidden;
            height: 100%;
        }
    }
</style>
<style lang="less" scoped>
    .drawer_height {
        height: calc(100vh - 6rem);
    }
</style>
