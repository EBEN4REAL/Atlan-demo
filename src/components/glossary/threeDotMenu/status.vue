// TODO: this component can be removed by making
/discovery/preview/tabs/info/assetDetails/status.vue more generic
<template>
    <div class="flex flex-col" style="width: 300px p-4">
        <div class="">
            <a-radio-group v-model:value="statusId" class="w-full mb-2">
                <div class="flex flex-col">
                    <a-radio
                        v-for="item in List"
                        :key="item.id"
                        :value="item.id"
                        class="mb-1"
                    >
                        <span class="align-middle">
                            <span class="text-gray-700 svg-icon">
                                <component
                                    :is="item.icon"
                                    class="w-auto h-4 ml-1 mr-2 pushtop"
                                />
                                {{ item.label }}
                            </span>
                        </span>
                    </a-radio>
                </div>
            </a-radio-group>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRefs, inject } from 'vue'
    import { useMagicKeys } from '@vueuse/core'
    import StatusBadge from '@common/badge/status/index.vue'

    import { List } from '~/constant/status'
    import updateStatus from '~/composables/asset/updateStatus'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { StatusBadge },

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            // const isLoading = ref(false);
            const { selectedAsset } = toRefs(props)

            const {
                handleCancel,
                update,
                isReady,
                state,
                statusId,
                statusMessage,
                isCompleted,
                isLoading,
            } = updateStatus(selectedAsset)

            const animationPoint = ref(null)
            const message = ref('')

            const handleUpdate = () => {
                update()
            }
            const handleTextAreaUpdate = (e: any) => {
                statusMessage.value = e.target.value
            }

            const keys = useMagicKeys()
            const esc = keys.Escape

            watch(statusId, () => {
                update()
            })
            watch(esc, (v) => {
                if (v) {
                    handleCancel()
                }
            })
            watch(isReady, () => {
                if (isReady.value) {
                    emit('update:selectedAsset', selectedAsset.value)
                }
            })

            return {
                handleUpdate,
                handleCancel,
                handleTextAreaUpdate,
                message,
                selectedAsset,
                isReady,
                state,
                statusId,
                statusMessage,
                isCompleted,
                List,
                animationPoint,
                isLoading,
            }
        },
    })
</script>

<style lang="less" module>
    .popover {
        :global(.ant-popover-inner-content) {
            @apply p-4 !important;
        }
    }
</style>
