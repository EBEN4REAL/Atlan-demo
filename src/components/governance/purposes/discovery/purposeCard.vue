<template>
    <div
        class="flex flex-col justify-between p-3 border rounded cursor-pointer purpose-card hover:border-primary"
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
            <div class="h-8 mt-1">
                <span class="text-gray-500 line-clamp-2">{{
                    purpose?.description || 'No description'
                }}</span>
            </div>
        </div>
        <!-- footer -->
        <div class="flex items-center justify-between mt-3">
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
        <div
            class="flex items-center justify-between pt-2 mt-3 border-t border-gray-200"
        >
            <div class="text-xs text-gray-500">Updated {{ lastUpdate }}</div>
            <div
                :class="`p-1 text-xs rounded tag ${
                    purpose.enabled
                        ? 'enabled-tag'
                        : 'disabled-tag text-gray-500'
                } `"
            >
                {{ purpose.enabled ? 'Enabled' : 'Disabled' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        onMounted,
        toRefs,
        computed,
    } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useRoute, useRouter } from 'vue-router'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useTimeAgo } from '@vueuse/core'
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
            const lastUpdate = computed(() => {
                return useTimeAgo(
                    purpose.value.updatedAt || purpose.value.createdAt
                ).value
            })
            return { lastUpdate }
        },
    })
</script>
<style lang="less" scoped>
    .purpose-card {
        box-shadow: 0px 1px 0px 0px #0000000d;
        // height: 120px;
        &:hover {
            box-shadow: 0px 2px 8px 0px #0000001a;
        }
    }
    .dot {
        height: 4px;
        width: 4px;
        border-radius: 50%;
    }
    .enabled-tag {
        border: 1px solid #0080624d;
        background: #e3fdf7;
        color: #008062;
    }
    .tag {
        height: fit-content;
        line-height: 10px !important;
    }
    .disabled-tag {
        height: fit-content;
        border: 1px solid #e0e4eb;
        background: #f6f7f9;
    }
</style>
