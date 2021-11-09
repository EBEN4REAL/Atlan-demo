<template>
    <div class="p-2 rounded" style="width: 321px">
        <div class="mb-6">
            <p class="mb-2 text-base font-bold text-gray-700">
                Make {{ item?.attributes?.name }} public
            </p>
            <p class="mb-0 text-black">
                You won't be able to move it back to your personal space.
            </p>
        </div>
        <div class="flex justify-end w-full">
            <a-button
                class="px-5 mr-4 text-sm border rounded"
                style="width: 100px"
                type="default"
                @click="cancel"
                >Cancel</a-button
            >
            <a-button
                class="px-5 text-sm rounded"
                type="primary"
                :loading="isSaving"
                @click="publishItem"
                >Make public</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, PropType, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        emits: ['publish', 'cancel'],
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isSaving: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { item, isSaving } = toRefs(props)

            const cancel = () => {
                emit('cancel')
            }
            const publishItem = () => {
                emit('publish')
            }
            return {
                isSaving,
                cancel,
                publishItem,
                item,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .box {
        height: 90%;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
