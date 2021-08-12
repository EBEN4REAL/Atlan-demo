<template>
    <div class="w-5/12">
        <p class="flex-1 mb-1">Experts</p>
        <div class="flex flex-wrap">
            <div
                class="
                    flex
                    items-center
                    text-sm
                    mr-2.5
                    p-2
                    owner-expert
                    border border-transparent
                    hover:border-gray-100
                    rounded
                "
            >
                <div
                    class="flex items-center px-1 py-1 mr-1 rounded-full  _bg-primary-light"
                >
                    <fa icon="fal users" class="text-primary" />
                </div>
                <span class="text-gray truncate ...">Sale Team</span>
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
