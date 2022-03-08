<template>
    <div
        class="flex flex-col justify-between px-4 py-3 border rounded cursor-pointer purpose-card hover:bg-gray-100"
        @click="$emit('select', purpose)"
    >
        <div>
            <!-- header -->
            <div class="flex">
                <span
                    class="mb-0 font-bold cursor-pointer ant-typography ant-typography-ellipsis ant-typography-single-line text-md text-primary hover:underline"
                    >{{ purpose?.displayName }}</span
                >
            </div>
            <!-- body -->
            <div>
                <span class="text-gray-500 line-clamp-2">{{
                    purpose?.description || 'No description'
                }}</span>
            </div>
        </div>
        <!-- footer -->
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="flex items-center">
                    <AtlanIcon
                        icon="ClassificationShield"
                        class="w-3 h-3 mr-1 text-gray-500 stroke-current mb-0.5"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        purpose.tags.length
                    }}</span>
                </div>
                <div class="mx-2 bg-gray-300 dot"></div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="Policies"
                        class="w-3 h-3 mr-1 text-gray-400 mb-0.5"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        purpose.metadataPolicies?.length +
                        purpose.dataPolicies?.length
                    }}</span>
                </div>
                <!-- <div class="mx-2 bg-gray-300 dot"></div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="Query"
                        class="w-3 h-3 mr-1 text-gray-400"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        purpose.dataPolicies?.length
                    }}</span>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, onMounted, toRefs } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useRoute, useRouter } from 'vue-router'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'PurposeCard',
        emits: ['select'],
        components: { AtlanIcon },
        props: {
            purpose: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { purpose } = toRefs(props)
            return {}
        },
    })
</script>
<style lang="less" scoped>
    .purpose-card {
        height: 120px;
    }
    .dot {
        height: 4px;
        width: 4px;
        border-radius: 50%;
    }
</style>
