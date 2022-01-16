<template>
    <div
        class="grid items-center justify-between grid-cols-10 pl-4 bg-white border-t border-solid border-style-500 group gap-x-4 request-card"
        style="height: 72px"
        :class="{
            'bg-primary-light': selected,
            'active-request outline-1 bg-primary-light': active,
            'bg-primary-light': activeHover === request.id,
        }"
        @click="$emit('select')"
    >
        <div class="flex items-center col-span-4 overflow-hidden">
            <!-- TODO: Uncomment for bulk selection -->
            <!-- <a-checkbox :checked="selected" class="mr-4" /> -->
            <AssetPiece
                v-if="request.destinationQualifiedName"
                :asset-qf-name="request.destinationQualifiedName"
                :entity-type="request?.entityType"
            />
            <span v-else class="text-sm overflow-ellipsis">
                {{
                    primaryText[request.requestType]
                        ? primaryText[request.requestType](request)
                        : ''
                }}
            </span>
        </div>
        <div class="flex items-center col-span-3">
            <ClassificationPiece
                v-if="
                    request?.requestType === 'create_typedef' &&
                    request?.payload?.classificationDefs
                "
                :data="request.payload.classificationDefs"
            />
            <ClassificationPiece
                v-else-if="request?.requestType === 'attach_classification'"
                :type-name="request.payload.typeName"
            />

            <TermPiece
                v-else-if="
                    request?.requestType === 'create_term' && request?.payload
                "
                :data="request.payload"
            />

            <TermPiece
                v-else-if="request.requestType === 'term_link'"
                :data="request?.sourceEntity?.attributes"
            />

            <AttrPiece
                v-else-if="request.destinationAttribute"
                :name="request.destinationAttribute"
                :value="request.destinationValue"
            />

            <AssetPiece
                v-else-if="request.sourceQualifiedName"
                :asset-qf-name="request.sourceQualifiedName"
                :entity-type="request?.entityType"
            />
        </div>

        <div class="flex items-center justify-end col-span-3 pr-4">
            <AtlanIcon
                v-if="state.isLoading"
                icon="CircleLoader"
                class="w-5 h-5 text-gray animate-spin"
            />
            <!-- <div v-else-if="selected"> -->
            <template v-else>
                <div
                    v-if="activeHover === request.id"
                    class="items-center justify-center w-full font-bold"
                >
                    <RequestActions
                        v-if="request.status === 'active'"
                        :request="request"
                        @accept="handleApproval"
                        @reject="handleRejection"
                    />
                    <div
                        v-else-if="request.status === 'approved'"
                        class="font-light text-success"
                    >
                        Approved by
                        <DatePiece
                            label="Created At"
                            :date="request.approvedBy[0].timestamp"
                            class="font-light text-gray-500"
                        />
                    </div>
                    <div
                        v-else-if="request.status === 'rejected'"
                        class="text-error"
                    >
                        Rejected
                    </div>
                </div>
                <div v-else class="flex w-1/2 gap-x-2">
                    <Avatar
                        :allow-upload="false"
                        :avatar-name="request.created_by_user?.username"
                        avatar-size="24"
                        :avatar-shape="'circle'"
                        :image-url="atlanLogo"
                    />

                    <div class="flex flex-col">
                        <UserPiece
                            :user="request.created_by_user"
                            :is-pill="false"
                            :default-name="'Atlan Bot'"
                        />
                        <DatePiece
                            label="Created At"
                            :date="request.createdAt"
                            class="text-gray-500"
                        />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, reactive, toRefs, onMounted } from 'vue'
    import { message } from 'ant-design-vue'
    // import { useMagicKeys, whenever } from '@vueuse/core'
    import atlanLogo from '~/assets/images/atlan-logo.png'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    import RequestActions from './requestActions.vue'
    import Avatar from '~/components/common/avatar/index.vue'
    import { Users } from '~/services/service/users/index'
    import ClassificationPiece from './pieces/classifications.vue'
    import AssetPiece from './pieces/asset.vue'
    import AttrPiece from './pieces/attributeUpdate.vue'
    import UserPiece from './pieces/user.vue'
    import DatePiece from './pieces/date.vue'
    import TermPiece from './pieces/term.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    import { RequestAttributes } from '~/types/atlas/requests'
    import {
        approveRequest,
        declineRequest,
    } from '~/composables/requests/useRequests'
    import { primaryText, requestTypeIcon } from './requestType'

    export default defineComponent({
        name: 'RequestListItem',
        components: {
            VirtualList,
            RequestActions,
            ClassificationPiece,
            AssetPiece,
            AttrPiece,
            UserPiece,
            DatePiece,
            TermPiece,
            Avatar,
        },
        props: {
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
            selected: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            active: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            activeHover: {
                type: String,
                default: () => '',
                required: false,
            },
        },
        emits: ['select', 'action'],
        setup(props, { emit }) {
            const { request } = toRefs(props)

            const state = reactive({
                isLoading: false,
                message: '',
            })

            function raiseErrorMessage(msg?: string) {
                message.error(msg || 'Request modification failed, try again')
            }

            async function handleApproval() {
                state.isLoading = true
                try {
                    await approveRequest(request.value.id, state.message)
                    request.value.message = state.message
                    request.value.status = 'approved'
                    emit('action', request.value)
                    message.success('Request approved')
                    useAddEvent('governance', 'requests', 'resolved', {
                        action: 'approve',
                    })
                } catch (error) {
                    raiseErrorMessage()
                }
                state.isLoading = false
            }

            async function handleRejection() {
                state.isLoading = true
                try {
                    await declineRequest(request.value.id, state.message)
                    request.value.message = state.message
                    request.value.status = 'rejected'
                    emit('action', request.value)
                    message.success('Request declined')
                    useAddEvent('governance', 'requests', 'resolved', {
                        action: 'decline',
                    })
                } catch (error) {
                    raiseErrorMessage()
                }
                state.isLoading = false
            }
            onMounted(() => {
                if (request.value.status === 'approved') {
                    const payloadFilter = {
                        $and: [{ id: `${request.value.approvedBy[0].userId}` }],
                    }
                    const { data } = Users.List({
                        limit: 1,
                        offset: 0,
                        filter: JSON.stringify(payloadFilter),
                    })
                }
            })

            return {
                handleApproval,
                handleRejection,
                primaryText,
                requestTypeIcon,
                state,
                atlanLogo,
            }
        },
    })
</script>

<style lang="less" scoped>
    .request-card {
        &.active-request {
            // outline-style: solid !important;
            // outline-color: rgb(82, 119, 215) !important;
        }
        outline-offset: -1px !important;
    }
</style>
