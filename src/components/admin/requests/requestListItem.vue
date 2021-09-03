<template>
    <div
        class="grid items-center justify-between grid-cols-10 my-1 gap-x-4"
        style="height: 50px"
        :class="{
            'bg-primary-light': selected,
            'ring-1 ring-primary': active,
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
            <AtlanIcon class="mr-4" :icon="requestTypeIcon[request.re]" />

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
            <template v-if="selected">
                <AtlanIcon
                    v-if="state.isLoading && !state.error"
                    icon="CircleLoader"
                    class="w-5 h-5 text-gray animate-spin"
                ></AtlanIcon>
                <template v-else>
                    <AtlanButton color="error" @click="handleRejection" bold>
                        Reject
                    </AtlanButton>
                    <AtlanButton color="success" @click="handleApproval" bold>
                        Approve
                    </AtlanButton>
                </template>
            </template>
            <template v-else>
                <UserPiece :user="request.createdByUser" />
                <DatePiece label="Created At" :date="request.created_at" />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        reactive,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { message } from 'ant-design-vue'

    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import AtlanButton from '@/UI/button.vue'

    import ClassificationPiece from './pieces/classifications.vue'
    import AssetPiece from './pieces/asset.vue'
    import AttrPiece from './pieces/attributeUpdate.vue'
    import UserPiece from './pieces/user.vue'
    import DatePiece from './pieces/date.vue'
    import TermPiece from './pieces/term.vue'

    import { RequestAttributes } from '~/types/atlas/requests'
    import { takeAction } from '~/composables/requests/useRequests'
    import { primaryText, requestTypeIcon } from './requestType'

    export default defineComponent({
        name: 'RequestListItem',
        components: {
            VirtualList,
            AtlanButton,
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
        emits: ['select'],
        setup(props) {
            const { request } = toRefs(props)
            const state = reactive({
                error: ref({}),
                isLoading: ref(false),
                message: '',
            })

            async function handleApproval() {
                const { error, isLoading } = takeAction(request.value.id, {
                    action: 'approved',
                    message: state.message,
                })
                state.error = error
                state.isLoading = isLoading
            }

            async function handleRejection() {
                const { error, isLoading } = takeAction(request.value.id, {
                    action: 'rejected',
                    message: state.message,
                })
                state.error = error
                state.isLoading = isLoading
            }

            watch(
                () => state.error,
                () => {
                    if (state.error)
                        message.error('Request modification failed, try again')
                }
            )

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
