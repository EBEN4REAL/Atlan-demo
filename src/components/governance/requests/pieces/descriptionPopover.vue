<template>
    <div class="truncate">
        <a-popover
            v-model:visible="visible"
            trigger="hover"
            placement="topLeft"
        >
            <template #title>
                <div
                    class="flex flex-row items-center justify-between py-2 text-gray"
                >
                    <h1 class="text-sm font-bold">Update Description</h1>
                    <atlan-icon
                        icon="Close"
                        class="cursor-pointer text-blueGray h-7 hover:text-gray"
                        @click="visible = !visible"
                    />
                </div>
            </template>

            <template #content>
                <div
                    class="flex flex-col px-4 pt-4 -mb-2 text-sm text-gray"
                    :class="{
                        'pb-4': !showActions,
                    }"
                    :style="{
                        width: '400px',
                    }"
                >
                    <div
                        class="w-full p-2 py-2.5 bg-gray-100 border-l-2 rounded-md border-primary"
                    >
                        <h2 class="font-normal text-gray-500">
                            Newer description
                        </h2>

                        <div class="w-full mt-2 overflow-x-scroll desc-wrapper">
                            <p class="font-medium desc-text">
                                {{ request.destinationValue }}
                            </p>
                        </div>
                    </div>

                    <div
                        v-if="request.message"
                        class="flex flex-row mt-6 font-normal"
                    >
                        <atlan-icon
                            icon="Quotes"
                            class="h-4 text-gray-500 cursor-pointer"
                            @click="visible = !visible"
                        />

                        <p class="ml-3">
                            {{ request.message }}
                        </p>
                    </div>

                    <div class="flex flex-row items-center mt-3">
                        <Avatar
                            :allow-upload="false"
                            :avatar-name="request.createdBy"
                            :avatar-size="16"
                            :avatar-shape="'circle'"
                            class="mr-2"
                            :image-url="imageUrl(request.createdBy)"
                        />

                        <p class="text-xs font-normal text-gray-500">
                            From {{ request.createdBy }}
                        </p>
                    </div>
                </div>

                <div v-if="showActions">
                    <a-divider />

                    <div class="w-full pb-4 -mt-2">
                        <RequestActions
                            :classes="`w-fit bg-transparent ml-auto -mr-4 px-0`"
                            :request="request"
                            :loading="loading"
                            :is-approval-loading="isApprovalLoading"
                            @accept="$emit('accept')"
                            @reject="$emit('reject')"
                        />
                    </div>
                </div>
            </template>

            <span>{{ request.destinationValue }}</span>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, watch } from 'vue'

    import { RequestAttributes } from '~/types/atlas/requests'

    import Avatar from '~/components/common/avatar/index.vue'
    import RequestActions from '../requestActions.vue'

    export default defineComponent({
        components: {
            Avatar,
            RequestActions,
        },

        props: {
            loading: { type: Boolean, required: true },
            isApprovalLoading: { type: Boolean, required: true },
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
            showActions: {
                type: Boolean,
                default: false,
            },
        },

        emits: ['switchUpdatePopover', 'accept', 'reject'],

        setup(props, { emit }) {
            const imageUrl = (username: String) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const visible = ref(false)

            watch(visible, (newVal) => {
                emit('switchUpdatePopover', newVal)
            })

            return { visible, imageUrl }
        },
    })
</script>

<style scoped>
    .desc-wrapper {
        max-height: 6.5rem;
    }
    .w-fit {
        width: fit-content;
    }
</style>
