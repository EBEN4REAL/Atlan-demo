<template>
    <template v-if="name === 'certificateStatus'">
        <div class="flex flex-col">
            <span class="pb-1 mr-2 text-sm text-gray-500">
                Update Certificate</span
            >
            <StatusBadge :status-id="value" show-no-status show-label />
        </div>
    </template>
    <template v-else>
        <div class="flex flex-col w-full">
            <span class="pb-1 pr-2 text-gray-500">{{ attrLabel }}</span>
            <span class="text-ellipsis text-gray">
                <div
                    v-if="
                        (name === 'ownerUsers' || name === 'ownerGroups') &&
                        valueArray?.length
                    "
                    class="flex items-center"
                >
                    <template v-for="el in valueArray.slice(0, 1)" :key="el">
                        <UserPill v-if="name === 'ownerUsers'" :username="el" />
                        <GroupPill v-else :name="el" />
                    </template>
                    <a-popover>
                        <template #content>
                            <div class="flex flex-col">
                                <template
                                    v-for="i in valueArray.slice(1)"
                                    :key="i"
                                >
                                    <span
                                        class="flex items-center px-2 py-1 border-gray-200"
                                        ><atlan-icon
                                            icon="User"
                                            class="h-3 mr-1"
                                        />{{ i }}</span
                                    >
                                </template>
                            </div>
                        </template>

                        <span
                            v-if="valueArray?.length > 1"
                            class="flex items-center ml-1 cursor-pointer text-primary"
                            >+ {{ valueArray?.length - 1 }}
                        </span>
                    </a-popover>
                </div>

                <div v-else class="w-full">
                    <Truncate
                        v-if="name !== 'userDescription'"
                        :tooltip-text="value"
                    />

                    <div v-else class="truncate">
                        <a-popover v-model:visible="visible" trigger="hover">
                            <template #title>
                                <div
                                    class="flex flex-row items-center justify-between py-2"
                                >
                                    <h1 class="text-lg font-semibold">
                                        User Description
                                    </h1>
                                    <atlan-icon
                                        icon="Close"
                                        class="text-gray-400 cursor-pointer h-7 hover:text-blueGray"
                                        @click="visible = !visible"
                                    />
                                </div>
                            </template>

                            <template #content>
                                <div class="flex flex-col px-4 pt-5 w-96">
                                    <div
                                        class="w-full p-3 py-2.5 bg-gray-100 border-l-4 rounded-md border-primary"
                                    >
                                        <h2 class="font-bold text-gray-400">
                                            New description
                                        </h2>

                                        <div
                                            class="w-full overflow-x-scroll desc-wrapper"
                                        >
                                            <p class="mt-3 desc-text">
                                                {{ value }}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        v-if="request.message"
                                        class="flex flex-row mt-8"
                                    >
                                        <atlan-icon
                                            icon="Quotes"
                                            class="h-5 cursor-pointer text-blueGray"
                                            @click="visible = !visible"
                                        />

                                        <p class="ml-4">
                                            {{ request.message }}
                                        </p>
                                    </div>

                                    <div
                                        class="flex flex-row items-center mt-3"
                                    >
                                        <Avatar
                                            :allow-upload="false"
                                            :avatar-name="request.createdBy"
                                            :avatar-size="28"
                                            :avatar-shape="'circle'"
                                            class="mr-2"
                                            :image-url="
                                                imageUrl(request.createdBy)
                                            "
                                        />

                                        <p
                                            class="text-sm text-gray-400 font-base"
                                        >
                                            From {{ request.createdBy }}
                                        </p>
                                    </div>
                                </div>

                                <a-divider />

                                <div class="w-full pb-4 -mt-2">
                                    <RequestActions
                                        v-if="request.status === 'active'"
                                        :classes="`w-fit bg-transparent ml-auto -mr-4 px-0`"
                                        :request="request"
                                        :loading="loading"
                                        :is-approval-loading="isApprovalLoading"
                                        @accept="$emit('accept')"
                                        @reject="$emit('reject')"
                                    />
                                </div>
                            </template>

                            <span>{{ value }}</span>
                        </a-popover>
                    </div>
                </div>
            </span>
        </div>
    </template>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        toRefs,
        ref,
        PropType,
        watch,
    } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import Truncate from '@/common/ellipsis/index.vue'
    import UserPill from '@common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import RequestActions from '../requestActions.vue'
    import { RequestAttributes } from '~/types/atlas/requests'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        props: {
            name: { type: String, required: true },
            value: { type: String, required: true },
            valueArray: { type: Array, required: true },
            loading: { type: Boolean, required: true },
            isApprovalLoading: { type: Boolean, required: true },
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
        },
        components: {
            Avatar,
            StatusBadge,
            Truncate,
            UserPill,
            GroupPill,
            RequestActions,
        },

        mounted() {
            console.log('Heyyyy: ', this.request)
        },
        setup(props, { emit }) {
            const { name } = toRefs(props)
            const labelMap = {
                userDescription: 'Update description',
                certificateStatus: 'Update certificate',
                ownerUsers: 'Update Owners',
                ownerGroups: 'Update Owners',
                name: 'Update Name',
            }

            const imageUrl = (username: String) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const visible = ref(false)

            watch(visible, (newVal) => {
                emit('switchUpdatePopover', newVal)
            })

            const attrLabel = computed(() => labelMap[name.value] || 'ATTR')

            return { attrLabel, visible, imageUrl }
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
