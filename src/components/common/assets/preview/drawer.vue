<template>
    <teleport to="#overAssetSidebar">
        <a-drawer
            :key="data?.guid"
            v-model:visible="visible"
            placement="right"
            :get-container="false"
            :class="$style.drawerStyles"
            :closable="false"
            :mask-closable="showMask"
            :style="{ position: 'absolute' }"
            :width="420"
            :mask="showMask"
            @close="$emit('closeDrawer')"
        >
            <div
                v-if="!showMask && visible"
                class="close-btn"
                @click="() => $emit('closeDrawer')"
            >
                <AtlanIcon icon="Add" class="text-white" />
            </div>
            <AssetPreview
                :selected-asset="data"
                :is-drawer="true"
                @closeDrawer="$emit('closeDrawer')"
            ></AssetPreview> </a-drawer
    ></teleport>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs, provide } from 'vue'
    import AssetPreview from '@/common/assets/preview/index.vue'
    import useEvaluate from '~/composables/auth/useEvaluate'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'

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
                default: true,
            },
            showMask: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['closeDrawer', 'update'],

        setup(props, { emit }) {
            const { showDrawer, data } = toRefs(props)

            const visible = ref(false)

            const body = ref({})
            const { refresh } = useEvaluate(body, false)
            const { getAssetEvaluationsBody } = useAssetEvaluate()

            const updateDrawerList = (asset) => {
                emit('update', asset)
            }

            provide('updateDrawerList', updateDrawerList)

            watch(showDrawer, () => {
                visible.value = showDrawer.value
            })

            watch(visible, () => {
                if (visible.value) {
                    body.value = {
                        entities: getAssetEvaluationsBody(data.value),
                    }
                    refresh()
                }
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

<style lang="less" scoped>
    .close-btn {
        height: 32px;
        width: 32px;
        background: #3e4359cc;
        position: fixed;
        border-radius: 50%;
        display: grid;
        place-items: center;
        transform: rotate(45deg);
        left: -40px;
        top: 60px;
        cursor: pointer;
    }
</style>
