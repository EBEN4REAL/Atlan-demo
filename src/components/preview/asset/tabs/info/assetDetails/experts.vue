<template>
    <div class="w-full mb-4">
        <p class="flex-1 mb-2">Experts</p>
        <div class="flex flex-wrap">
            <div
                class="
                    flex
                    items-center
                    mr-3
                    cursor-pointer
                    my-0
                    bg-gray-light
                    rounded-full
                    px-3
                    py-1.5
                "
            >
                <div
                    class="flex items-center px-1 py-1 mr-2 rounded-full  bg-primary"
                >
                    <fa icon="fas users" class="text-white" />
                </div>
                <div
                    class="
                        text-gray-700
                        mb-0
                        truncate
                        text-sm
                        capitalize
                        max-owner-name-width
                        ...
                    "
                >
                    <span class="text-gray truncate ...">Sale Team</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            return {
                selectedAsset,
            }
        },
    })
</script>

<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
</style>
