<template>
    <div
        class="flex items-center justify-between mb-2"
        :class="{
            'bg-primary-light': selected,
            'border-2 border-primary': active,
        }"
        @click="$emit('select')"
    >
        <div>
            <p class="mb-1">{{ request.id }}</p>
            <p class="mb-0">{{ request.message }}</p>
        </div>
        <span>{{ request.status }}</span>
        <AtlanIcon
            v-if="state.isLoading && !state.error"
            icon="CircleLoader"
            class="w-5 h-5 text-gray animate-spin"
        ></AtlanIcon>
        <template v-else>
            <AtlanButton color="secondary" @click="handleRejection">
                Reject
            </AtlanButton>
            <AtlanButton color="light" @click="handleApproval">
                Approve
            </AtlanButton>
        </template>
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

    import { takeAction } from '~/composables/requests/useRequests'
    import { RequestAttributes } from '~/types/atlas/requests'

    export default defineComponent({
        name: 'RequestListItem',
        components: { VirtualList, AtlanButton },
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
                state,
            }
        },
    })
</script>

<style></style>
