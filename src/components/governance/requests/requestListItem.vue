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

        <div class="flex items-center col-span-3 pr-3 ml-10">
            <AtlanIcon
                v-if="state.isLoading"
                icon="CircleLoader"
                class="w-5 h-5 text-gray animate-spin"
            />
            <!-- <div v-else-if="selected"> -->
            <template v-else>
                <div
                    v-if="activeHover === request.id"
                    class="items-center font-bold"
                >
                    <RequestActions
                        v-if="request.status === 'active'"
                        :request="request"
                        @accept="handleApproval"
                        @reject="handleRejection"
                    />
                    <div
                        v-else-if="
                            request.status === 'approved' ||
                            request.status === 'rejected'
                        "
                        class="flex items-center font-light"
                        :class="
                            request.status === 'approved'
                                ? 'text-success'
                                : 'text-error'
                        "
                    >
                        <IconStatus
                            :request="request"
                            :name-updater="nameUpdater"
                        />
                        {{
                            request.status === 'approved'
                                ? 'Approved by'
                                : 'Rejected by'
                        }}
                        <div class="flex items-center mx-2 truncate">
                            <Avatar
                                :allow-upload="false"
                                :avatar-name="nameUpdater"
                                :avatar-size="18"
                                :avatar-shape="'circle'"
                                class="mr-2"
                            />

                            <span class="text-gray-700">{{ nameUpdater }}</span>
                        </div>
                        <DatePiece
                            label="Created At"
                            :no-popover="true"
                            class="font-light text-gray-500"
                            :date="
                                request.status === 'approved'
                                    ? request.approvedBy[0].timestamp
                                    : request.rejectedBy[0].timestamp
                            "
                        />
                    </div>
                </div>
                <div v-else class="flex">
                    <div class="flex items-center w-52 gap-x-2">
                        <IconStatus
                            :request="request"
                            :name-updater="nameUpdater"
                        />
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
                    <!-- <div class="flex items-center">
                        <AtlanIcon
                            v-if="
                                request.status === 'approved' &&
                                request.approvedBy[0]?.message
                            "
                            class="mr-3 text-success check-icon"
                            icon="MessageSuccess"
                        />
                        <AtlanIcon
                            v-if="
                                request.status === 'approved' &&
                                !request.approvedBy[0]?.message
                            "
                            class="mr-2 text-success check-icon"
                            icon="Check"
                        />
                        <div
                            class="flex items-center font-light"
                            :class="
                                request.status === 'approved'
                                    ? 'text-success'
                                    : 'text-error'
                            "
                        >
                            {{
                                request.status === 'approved'
                                    ? 'Approved by'
                                    : 'Rejected by'
                            }}

                            <div class="flex items-center mx-2 truncate">
                                <Avatar
                                    :allow-upload="false"
                                    :avatar-name="nameUpdater"
                                    :avatar-size="18"
                                    :avatar-shape="'circle'"
                                    class="mr-2"
                                />

                                <span class="text-gray-700">{{
                                    nameUpdater
                                }}</span>
                            </div>
                            <DatePiece
                                label="Created At"
                                :date="
                                    request.status === 'approved'
                                        ? request.approvedBy[0].timestamp
                                        : request.rejectedBy[0].timestamp
                                "
                                :no-popover="true"
                                class="font-light text-gray-500"
                            />
                        </div>
                    </div> -->
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        reactive,
        toRefs,
        onMounted,
        watch,
        ref,
        computed,
    } from 'vue'
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
    import IconStatus from './iconStatus.vue'

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
            IconStatus,
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
            const updatedBy = ref({})
            const state = reactive({
                isLoading: false,
                message: '',
            })

            function raiseErrorMessage(msg?: string) {
                message.error(msg || 'Request modification failed, try again')
            }

            async function handleApproval(messageProp = '') {
                state.isLoading = true
                try {
                    await approveRequest(request.value.id, messageProp)
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

            async function handleRejection(messageProp = '') {
                state.isLoading = true
                try {
                    await declineRequest(request.value.id, messageProp)
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
                if (
                    request.value.status === 'approved' ||
                    request.value.status === 'rejected'
                ) {
                    const userId =
                        request.value.status === 'approved'
                            ? `${request.value.approvedBy[0].userId}`
                            : `${request.value.rejectedBy[0].userId}`
                    const payloadFilter = {
                        $and: [
                            {
                                id: userId,
                            },
                        ],
                    }
                    const { data } = Users.List(
                        {
                            limit: 1,
                            offset: 0,
                            filter: JSON.stringify(payloadFilter),
                        },
                        { cacheKey: userId }
                    )
                    watch(data, () => {
                        updatedBy.value = data.value.records[0]
                        console.log('updated', updatedBy.value)
                    })
                }
            })
            const nameUpdater = computed(() => updatedBy?.value?.username)
            return {
                handleApproval,
                handleRejection,
                primaryText,
                requestTypeIcon,
                state,
                atlanLogo,
                nameUpdater,
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

<style lang="less">
    .message-icon {
        transform: scale(1.4) !important;
    }
    .check-icon {
        transform: scale(1.4) !important;
    }
    .cross-icon {
        transform: scale(1.1) !important;
    }
    .message-cross-icon {
        transform: scale(1.5) !important;
    }
</style>
