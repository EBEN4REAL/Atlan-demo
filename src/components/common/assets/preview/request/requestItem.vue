<template>
    <div
        class="relative p-4 border-b cursor-pointer hover:bg-gray-100 card-container"
    >
        <template v-if="item.requestType === 'attach_classification'">
            <p class="text-gray-500">Link Classification</p>
            <div class="mt-1 w-fit">
                <ClassificationPill
                    :name="localClassification(item.payload.typeName).name"
                    :display-name="
                        localClassification(item.payload.typeName)?.displayName
                    "
                    :allow-delete="false"
                    :color="
                        localClassification(item.payload.typeName).options
                            ?.color
                    "
                    :no-hover="true"
                />
            </div>
            <div class="mt-1">
                <span class="text-sm text-gray-500">{{ item.createdBy }}</span>
                <span class="sparator" />
                <span class="text-sm text-gray-500">{{
                    createdTime(item.createdAt)
                }}</span>
            </div>
        </template>
        <template v-if="item.requestType === 'term_link'">
            <p class="text-gray-500">Link Term</p>
            <div class="mt-1">
                <Pill
                    :label="item?.sourceEntity?.attributes.name"
                    :has-action="false"
                >
                    <template #prefix>
                        <AtlanIcon icon="Term" />
                    </template>
                </Pill>
            </div>
            <div class="mt-1">
                <span class="text-sm text-gray-500">{{ item.createdBy }}</span>
                <span class="sparator" />
                <span class="text-sm text-gray-500">{{
                    createdTime(item.createdAt)
                }}</span>
            </div>
        </template>
        <div
            v-if="isLoading"
            class="absolute flex items-center justify-center loading-container"
        >
            <AtlanLoader />
        </div>
        <div
            v-else
            class="absolute items-center bg-gray-100 actions-container justify-evenly"
        >
            <a-tooltip placement="topLeft">
                <template #title>
                    <span>Reject</span>
                </template>
                <div
                    class="flex items-center justify-center cursor-pointer action-btn"
                    @click="handleRejection('')"
                >
                    <AtlanIcon class="btn-reject" icon="Cross" />
                </div>
            </a-tooltip>
            <a-tooltip placement="topLeft">
                <template #title>
                    <span>Approve</span>
                </template>
                <div
                    class="flex items-center justify-center cursor-pointer action-btn"
                    @click="handleApproval('')"
                >
                    <AtlanIcon class="btn-approve" icon="CheckCurrentColor" />
                </div>
            </a-tooltip>
            <div
                class="flex items-center justify-center cursor-pointer action-btn"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import {
        approveRequest,
        declineRequest,
    } from '~/composables/requests/useRequests'

    export default defineComponent({
        name: 'RequestItem',
        components: { Pill, ClassificationPill },
        props: {
            selectedAsset: {
                type: Object,
                default: () => ({}),
            },
            item: {
                type: Object,
                default: () => ({}),
            },
        },
        emits: ['handleUpdateData'],
        setup(props, { emit }) {
            const { item } = toRefs(props)
            const { classificationList } = useTypedefData()
            const createdTime = (time) => useTimeAgo(time).value
            const isLoading = ref(false)
            const localClassification = (typeName) =>
                classificationList.value.find((clsf) => clsf?.name === typeName)

            function raiseErrorMessage(msg?: string) {
                message.error(msg || 'Request modification failed, try again')
            }
            async function handleApproval(messageProp = '') {
                isLoading.value = true
                try {
                    await approveRequest(item.value.id, messageProp)
                    message.success('Request approved')
                    useAddEvent('governance', 'requests', 'resolved', {
                        action: 'approve',
                    })
                    emit('handleUpdateData', item.value)
                } catch (error) {
                    raiseErrorMessage()
                }
                isLoading.value = false
            }

            async function handleRejection(messageProp = '') {
                isLoading.value = true
                try {
                    await declineRequest(item.value.id, messageProp)
                    // emit('action', request.value)
                    message.success('Request declined')
                    useAddEvent('governance', 'requests', 'resolved', {
                        action: 'decline',
                    })
                    emit('handleUpdateData', item.value)
                } catch (error) {
                    raiseErrorMessage()
                }
                isLoading.value = false
            }
            return {
                createdTime,
                localClassification,
                handleRejection,
                isLoading,
                handleApproval,
            }
        },
    })
</script>

<style lang="less">
    .card-container {
        .classification-pill {
            width: fit-content;
        }
        &:hover {
            .actions-container {
                display: flex;
            }
        }
        .actions-container {
            width: 150px;
            height: 113px;
            right: 0;
            top: 0;
            display: none;
            .action-btn {
                height: 32px;
                width: 32px;
                border-radius: 50%;
                background: white;
                border: 1px solid #e6e6eb;
                .btn-approve {
                    color: #009542;
                }
                .btn-reject {
                    path {
                        stroke: #ec2e3b;
                    }
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    .sparator {
        border-right: 1px solid #e6e6eb;
        height: 10px;
        margin: 0 5px;
    }
    .container-loading {
        height: 500px;
    }
    .loading-container {
        z-index: 2;
        width: 150px;
        height: 113px;
        right: 0;
        top: 0;
    }
</style>
