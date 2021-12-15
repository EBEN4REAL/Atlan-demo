<template>
    <div
        class="grid items-center justify-between grid-cols-10 pl-4 my-1 bg-white border border-transparent rounded group gap-x-4 hover:bg-primary-light"
        style="height: 72px"
        :class="{
            'bg-primary-light': selected,
            'border-primary': active,
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
                {{ primaryText[request.requestType](request) }}
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
            ></AtlanIcon>
            <!-- <div v-else-if="selected"> -->
            <template v-else>
                <div
                    class="items-center justify-center hidden w-full font-bold group-hover:flex"
                >
                    <RequestActions
                        v-if="request.status === 'active'"
                        @accept="handleApproval"
                        @reject="handleRejection"
                    />
                    <div
                        v-else-if="request.status === 'approved'"
                        class="text-success"
                    >
                        Approved
                    </div>
                    <div
                        v-else-if="request.status === 'rejected'"
                        class="text-error"
                    >
                        Rejected
                    </div>
                </div>
                <div class="flex w-1/2 gap-x-2 group-hover:hidden">
                    <Avatar
                        :allow-upload="false"
                        :avatar-name="request.created_by_user?.username"
                        avatar-size="24"
                        :avatar-shape="'circle'"
                    />

                    <div class="flex flex-col">
                        <UserPiece
                            :user="request.created_by_user"
                            :is-pill="false"
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
    import { defineComponent, PropType, reactive, toRefs, inject } from 'vue'
    import { message } from 'ant-design-vue'
    import { useMagicKeys, whenever } from '@vueuse/core'

    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    import RequestActions from './requestActions.vue'
    import Avatar from '~/components/common/avatar/index.vue'

    import ClassificationPiece from './pieces/classifications.vue'
    import AssetPiece from './pieces/asset.vue'
    import AttrPiece from './pieces/attributeUpdate.vue'
    import UserPiece from './pieces/user.vue'
    import DatePiece from './pieces/date.vue'
    import TermPiece from './pieces/term.vue'

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
                } catch (error) {
                    raiseErrorMessage()
                }
                state.isLoading = false
            }
            return {
                handleApproval,
                handleRejection,
                primaryText,
                requestTypeIcon,
                state,
            }
        },
    })
</script>

<style></style>
