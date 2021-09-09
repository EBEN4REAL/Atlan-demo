<template>
    <div
        class="grid items-center justify-between grid-cols-10 pl-4 my-1 bg-white border border-transparent rounded  gap-x-4"
        style="height: 50px"
        :class="{
            'bg-primary-light': selected,
            'border-primary': active,
        }"
        @click="$emit('select')"
    >
        <div class="flex items-center col-span-4 overflow-hidden">
            <!-- <a-checkbox :checked="selected" class="mr-4" /> -->
            <AssetPiece
                v-if="request.destination_qf_name"
                :asset-qf-name="request.destination_qf_name"
            />
            <span v-else class="text-sm overflow-ellipsis">
                {{ primaryText[request.re](request) }}
            </span>
        </div>
        <!-- RHS -->
        <div class="flex items-center col-span-3">
            <AtlanIcon
                class="mr-4 text-gray-500"
                :icon="requestTypeIcon[request.re]"
            />

            <ClassificationPiece
                v-if="request?.payload?.classificationDefs"
                :data="request.payload.classificationDefs"
            />

            <AssetPiece
                v-if="request.source_qf_name"
                :asset-qf-name="request.source_qf_name"
            />

            <AttrPiece
                v-if="request.destination_attribute"
                :name="request.destination_attribute"
                :value="request.destination_value"
            />

            <TermPiece
                v-if="request.re === 'create_term' && request.payload"
                :data="request.payload"
            />
        </div>

        <div class="flex items-center justify-around col-span-3">
            <AtlanIcon
                v-if="state.isLoading"
                icon="CircleLoader"
                class="w-5 h-5 text-gray animate-spin"
            ></AtlanIcon>
            <template v-else-if="selected">
                <RequestActions
                    v-if="request.status === 'active'"
                    @accept="handleApproval"
                    @reject="handleRejection"
                />
                <div v-else-if="request.status === 'approved'">Approved</div>
                <div v-else-if="request.status === 'rejected'">Rejected</div>
            </template>
            <template v-else>
                <UserPiece :user="request.createdByUser" :is-pill="false" />
                <DatePiece label="Created At" :date="request.created_at" />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, reactive, toRefs } from 'vue'
    import { message } from 'ant-design-vue'

    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    import RequestActions from './requestActions.vue'

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
